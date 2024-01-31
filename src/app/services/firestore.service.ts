import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  onSnapshot,
  collection,
  query,
  setDoc,
  deleteDoc,
  doc,
  where,
  getDoc,
  updateDoc,
  QuerySnapshot,
  serverTimestamp,
  getDocs,
} from '@angular/fire/firestore';
import { Unsubscribe } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message.class';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';
import { Chat } from '../models/chat.class';
import { ChatService } from './chat.service';
import { StorageService } from './storage.service';
import { userConverter } from '../interfaces/firestore/converter';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);
  chatFilteredUserIds: string[] = [];

  // variable item to observe
  allUsers!: User[];
  allChannels!: Channel[];
  currentUser!: User;
  channelsArray: Channel[] = [];
  privateChats: Chat[] = [];
  chatUserData: User[] = [];
  public channelMember!: User[];

  // subject item
  private allUsersSubject = new BehaviorSubject<Array<User>>(this.allUsers);
  private allChannelsSubject = new BehaviorSubject<Array<Channel>>(
    this.allChannels
  );
  public currentUserSubject = new BehaviorSubject<User>(this.currentUser);
  private channelsArraySubject = new BehaviorSubject<any>(this.channelsArray);
  private privateChatsSubject = new BehaviorSubject<any>(this.privateChats);
  private chatUserDataSubject = new BehaviorSubject<any>(this.chatUserData);
  public channelMemberSubject = new BehaviorSubject<Array<User>>([]);

  // observable item
  allUsers$ = this.allUsersSubject.asObservable();
  allChannels$ = this.allChannelsSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();
  channelsArray$ = this.channelsArraySubject.asObservable();
  privateChats$ = this.privateChatsSubject.asObservable();
  chatUserData$ = this.chatUserDataSubject.asObservable();

  // unsub item
  unsubCurrentUser!: Unsubscribe;
  unsubChatUser!: Unsubscribe;
  unsubChannelMember!: Unsubscribe;

  // auth
  currentSignUpData: any = [];
  currentUserData: any = [];
  currentUserId!: any;
  currentSignUpId: any = (125478986565 * Math.random()).toFixed(0);
  existingEmail: number = 0;
  emailAlreadyExist = false;
  isGoogleAccount = false;

  // create channel
  channelAlreadyExist: boolean = false;
  newChannelName: string = '';
  newChannelDescription: string = '';
  usersAsMemberChache: User[] = [];
  newChannelRefId!: string;
  searchedUser: User[] = [];

  //create chat
  newChatRefId: string = '';

  constructor(
    private chatService: ChatService,
    private storageService: StorageService
  ) {}

  ngOnDestroy() {
    this.unsubCurrentUser();
    this.unsubChannelMember();
  }

  async getSingleDoc(colId: string, docId: string) {
    const docSnap = await getDoc(doc(this.firestore, colId, docId));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return;
    }
  }

  async getUserDoc(colId: string, docId: string) {
    try {
      const docSnap = await getDoc(
        doc(this.firestore, colId, docId).withConverter(userConverter)
      );
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return;
      }
    } catch (error) {
      return;
    }
  }

  async getSingleSubDoc(colId: string, docId: string) {
    const docSnap = await getDoc(
      doc(this.firestore, 'chatRecords', colId, 'messages', docId)
    );
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return;
    }
  }

  subCurrentUser(docId: string) {
    return onSnapshot(doc(this.firestore, 'user', docId), (doc: any) => {
      this.currentUser = doc.data();
      this.currentUserSubject.next(this.currentUser);
      this.getAllUserObservable();
      this.getAllChannelsObservable();
      this.getChannelsFromCurrentUser();
      this.getChatsFromCurrentUser();
    });
  }

  subChannelMember(channelId: string) {
    return onSnapshot(
      doc(this.firestore, 'channels', channelId),
      async (doc) => {
        if (doc.exists()) {
          const q = query(
            collection(this.firestore, 'user').withConverter(userConverter),
            where('id', 'in', doc.data()['member'])
          );

          const querySnapshot = await getDocs(q);
          const members: User[] = [];
          querySnapshot.forEach((doc) => {
            members.push(doc.data());
          });
          this.channelMemberSubject.next(members);
          this.channelMember = members;
        }
      }
    );
  }

  async updateSingleDoc(colId: string, docId: string, data: {}) {
    const docRef = doc(this.firestore, colId, docId);
    await updateDoc(docRef, data);
  }

  startSubUser(docId: string) {
    this.unsubCurrentUser = this.subCurrentUser(docId);
  }

  startSubChannelMember(channelId: string) {
    if (channelId) {
      this.unsubChannelMember = this.subChannelMember(channelId);
    }
  }

  getAllUserObservable() {
    return onSnapshot(query(collection(this.firestore, 'user')), (users) => {
      this.allUsers = [];
      users.forEach((user: any) => {
        this.allUsers.push(user.data());
      });
      this.allUsersSubject.next(this.allUsers);
    });
  }

  getAllChannelsObservable() {
    return onSnapshot(
      query(collection(this.firestore, 'channels')),
      (channels) => {
        this.allChannels = [];
        channels.forEach((channel: any) => {
          this.allChannels.push(channel.data());
        });
        this.allChannelsSubject.next(this.allChannels);
      }
    );
  }

  //>>>>>>>>>>>>>>>>>>>>>read chats from user

  getChatsFromCurrentUser() {
    onSnapshot(
      query(
        collection(this.firestore, 'privateChat'), //select database, collection
        where('chatBetween', 'array-contains', this.currentUser.id)
      ), //[path], [action], [searched element]
      (userInChats) => {
        //read array[searched element]
        this.renderChatsInArray(userInChats);
        this.getUserIdsFromChat();
      }
    );
  }

  renderChatsInArray(userInChats: QuerySnapshot) {
    this.privateChats = []; //reset variable array
    userInChats.forEach((doc: any) => {
      //read element of array
      this.privateChats.push(doc.data()); //element to array
      this.privateChatsSubject.next(this.privateChats); // update privateChats
    });
  }

  getUserIdsFromChat() {
    this.chatFilteredUserIds = [];
    this.chatFilteredUserIds.push(this.currentUser.id);
    this.privateChats.forEach((chatBetween) => {
      if (chatBetween.id !== this.currentUser.id) {
        let filteredUserId = this.filterUserId(chatBetween);
        this.chatFilteredUserIds.push(filteredUserId[0]);
      }
    });
    this.getUserDataFromChat();
  }

  filterUserId(chatBetween: Chat) {
    return chatBetween.chatBetween.filter(
      (filterUserIds: string) => filterUserIds !== this.currentUser.id
    );
  }

  async getUserDataFromChat() {
    this.chatUserData = [];
    this.chatFilteredUserIds.forEach((chatBetweenUserId) => {
      return onSnapshot(
        doc(this.firestore, 'user', chatBetweenUserId),
        (doc: any) => {
          this.chatUserData.push(doc.data());
          this.chatUserDataSubject.next(this.chatUserData);
        }
      );
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>read chats from user END

  getChannelsFromCurrentUser() {
    return onSnapshot(
      query(
        collection(this.firestore, 'channels'),
        where('member', 'array-contains', this.currentUser.id)
      ),
      (channelsArrays) => {
        this.channelsArray = [];
        channelsArrays.forEach((doc: any) => {
          this.channelsArray.push(doc.data());
        });
        this.channelsArraySubject.next(this.channelsArray);
      }
    );
  }

  async addMessage(docId: string, data: Message, fileToUpload?: any) {
    const newMsgRef = doc(
      collection(this.firestore, 'chatRecords', docId, 'messages')
    );

    if (fileToUpload) {
      data.file = await this.storageService.uploadFile(
        fileToUpload,
        docId,
        newMsgRef.id
      );
    }

    await setDoc(newMsgRef, this.getCleanJson(data, newMsgRef));
  }

  async addUser(
    userObject: any,
    name: any,
    photoUrl: any,
    googleAccount: boolean,
    activePrivateChats: any,
    memberInChannel: any,
    docId: any
  ) {
    name.trim();
    await setDoc(doc(this.firestore, 'user', docId), {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: userObject?.email,
      id: docId,
      photoUrl: photoUrl,
      onlineStatus: true,
      memberInChannel: memberInChannel,
      activePrivateChats: activePrivateChats,
      googleAccount: googleAccount,
    });
  }

  async deleteUser(docId: any) {
    await deleteDoc(this.getCurrentUserDataDoc(docId)).catch((err) => {
      console.log(err);
    });
  }

  async updateCurrentUserData(
    userId: string,
    userName: string,
    userEmail: string
  ) {
    await updateDoc(doc(this.firestore, 'user', userId), {
      name: userName,
      email: userEmail,
    });
  }

  async addPrivateChat(uId: any) {
    await setDoc(doc(this.firestore, 'privateChat', uId), {
      id: uId,
      chatBetween: [uId],
      chatRecord: '',
    });
    this.chatService.createNewChatRecord('private', uId);
  }

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>create new channel

  async checkChannelExist(channel: string) {
    this.channelAlreadyExist = false;
    let q = query(
      collection(this.firestore, 'channels'),
      where('name', '==', channel)
    );
    let querySnapshot = await getDocs(q);
    querySnapshot.forEach((existChannel: any) => {
      if (existChannel.data().name == channel) {
        this.channelAlreadyExist = true;
        console.error('Channel name exist already!');
      }
    });
  }

  async getAllUser() {
    this.usersAsMemberChache = [];
    const collRef = collection(this.firestore, 'user');
    const getColl = await getDocs(collRef);

    getColl.forEach((user: any) => {
      this.usersAsMemberChache.push(user.data());
    });
  }

  async addNewChannel(uId: string) {
    this.newChannelRefId = '';
    const newChannelRef = doc(collection(this.firestore, 'channels'));
    this.newChannelRefId = newChannelRef.id;
    let memberId: string[] = [];
    this.usersAsMemberChache.filter((user) => memberId.push(user.id));
    await setDoc(newChannelRef, this.getNewChannelCleanJson(uId, memberId));
    this.chatService.createNewChatRecord('channel', newChannelRef.id);
  }

  getNewChannelCleanJson(uId: string, memberId: string[]) {
    return {
      chatRecord: '',
      createdAt: serverTimestamp(),
      createdBy: uId,
      description: this.newChannelDescription,
      id: this.newChannelRefId,
      member: memberId,
      name: this.newChannelName,
    };
  }

  async updateUsers() {
    this.usersAsMemberChache.forEach((user) => {
      this.updateMemberInChanel(user);
    });
  }

  async updateMemberInChanel(user: User) {
    let newMembership: string[] = user.memberInChannel;
    newMembership.push(this.newChannelRefId);

    await updateDoc(doc(this.firestore, 'user', user.id), {
      memberInChannel: newMembership,
    });
  }

  getDefaultChannel() {
    return doc(collection(this.firestore, 'channels'), '3ZNVPzTSepCzgFNVsxUS');
  }

  async updateChannelMember(id: string) {
    const unsubscribe = onSnapshot(this.getDefaultChannel(), (list) => {
      let defautlChannel: any = list.data();
      defautlChannel['member'].push(id);
      this.addMemberToDefaultChannel(defautlChannel);
      unsubscribe();
    });
  }

  addMemberToDefaultChannel(defautlChannel: any) {
    updateDoc(this.getDefaultChannel(), {
      member: defautlChannel.member,
    }).catch((err) => {
      console.log(err);
    });
  }

  async setGetColl() {
    const collRef = collection(this.firestore, 'user');
    return await getDocs(collRef);
  }

  //>>>>>>>>>>>>>>>>>>create new channel all user END
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>create new chat

  async createNewChat(selectedUser: User) {
    const newChatRef = doc(collection(this.firestore, 'privateChat'));
    this.newChatRefId = newChatRef.id;
    let chatBetween: string[] = [];
    this.getCleanArrayChatBetween(chatBetween, selectedUser);
    await setDoc(
      newChatRef,
      this.getNewChatCleanJson(chatBetween, this.newChatRefId)
    );
    this.updateUsersPrivatChat(selectedUser, this.newChatRefId);
    chatBetween = [];
    this.chatService.createNewChatRecord('private', newChatRef.id);
    this.newChatRefId = '';
  }

  getCleanArrayChatBetween(chatBetween: string[], selectedUser: User) {
    chatBetween.push(this.currentUser.id);
    chatBetween.push(selectedUser.id);
  }

  getNewChatCleanJson(chatBetween: string[], newChatRefId: string) {
    return {
      chatBetween: chatBetween,
      chatRecord: '',
      id: newChatRefId,
    };
  }

  updateUsersPrivatChat(selectedUser: User, newChatRefId: string) {
    let chatBetween = [];
    chatBetween.push(this.currentUser);
    chatBetween.push(selectedUser);

    chatBetween.forEach((user) => {
      this.updatePrivateChats(user, newChatRefId);
    });
  }

  async updatePrivateChats(user: User, newChatRefId: string) {
    let activePrivateChats: string[] = user.activePrivateChats;
    activePrivateChats.push(newChatRefId);
    await updateDoc(doc(this.firestore, 'user', user.id), {
      activePrivateChats: activePrivateChats,
    });
    activePrivateChats = [];
  }

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>prepare and set data from/for firebase for AUTHENTICATION

  /**
   * This function looks for the email of the current user in the collection 'user' and saves the found object
   *
   * @param email - The email adress of the current logged-in user
   *
   */
  async checkSignUpEmail(email: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      onSnapshot(
        query(collection(this.firestore, 'user'), where('email', '==', email)),
        (existingEmail) => {
          this.existingEmail = existingEmail.docs.length;
          if (existingEmail.docs.length == 1) {
            const user = existingEmail.docs[0].data();
            this.currentUserId = user['id'];
            this.emailAlreadyExist = true;
          } else {
            this.emailAlreadyExist = false;
          }
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async setOnlineStatus(docId: any, status: string) {
    if (status == 'online') {
      await updateDoc(doc(this.firestore, 'user', docId), {
        onlineStatus: true,
      });
    }
    if (status == 'offline') {
      await updateDoc(doc(this.firestore, 'user', docId), {
        onlineStatus: false,
      });
    }
    if (docId == null) {
      //do nothing
    }
  }

  /**
   * Gets the information if the current user is already a google account or not
   *
   * @param id - Id/ docId of the current user
   *
   */
  async checkIfGoogleAccount(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      onSnapshot(
        this.getCurrentUserDataDoc(id),
        (list) => {
          const userData = list.data();
          this.isGoogleAccount = userData?.['googleAccount'];
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getCurrentUserDataDoc(docId: any) {
    return doc(collection(this.firestore, 'user'), docId);
  }

  getCleanJson(data: Message, doc: any): {} {
    return {
      id: doc.id,
      message: data.message,
      file: data.file,
      sentById: data.sentById,
      sentByName: data.sentByName,
      sentByPhotoUrl: data.sentByPhotoUrl,
      sentAt: serverTimestamp(),
      thread: data.thread,
      reactions: data.reactions,
    };
  }

  getCurrentDataCol(coll: string) {
    return collection(this.firestore, coll);
  }

  getCurrentDataDoc(coll: string, docId: any) {
    return doc(collection(this.firestore, coll), docId);
  }

  /**
   * This function gets clear json's of different data from different collections
   *
   * @param coll - Collection (firebase)
   * @param docId - Document id (firebase)
   *
   */
  async getJsonOfCurrentData(coll: string, docId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      onSnapshot(
        this.getCurrentDataDoc(coll, docId),
        (list) => {
          if (coll == 'currentSignUpData') {
            const signUpData = list.data();
            if (signUpData) {
              this.currentSignUpData = list.data();
              resolve(this.currentSignUpData);
            }
          }
          if (coll == 'currentUserData') {
            const currentUserData = list.data();
            if (currentUserData) {
              this.currentUserData = list.data();
              resolve('Data added successfully');
            }
          }
          if (coll == 'user') {
            const userData = list.data();
            if (userData) {
              this.currentUserData = list.data();
              resolve('Data added successfully');
            }
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * This function saves the current sign up data from sign-up.component and give it to choose-avatar-component to use for sign-up function
   *
   * @param name - The used name of current user
   * @param email - The used email of current user
   * @param password - The used password of current user
   */
  async addCurrentSignUpData(name: string, email: string, password: string) {
    await setDoc(
      doc(this.firestore, 'currentSignUpData', this.currentSignUpId),
      {
        name: name,
        email: email,
        password: password,
      }
    );
  }

  /**
   * This function saves the current user data meanwhile to merge the email-password-account with the google-account
   *
   */
  async addCurrentUserData() {
    return new Promise(async (resolve, reject) => {
      try {
        await setDoc(
          doc(this.firestore, 'currentUserData', this.currentUserData.id),
          {
            name: this.currentUserData.name,
            email: this.currentUserData.email,
            id: this.currentUserData.id,
            photoUrl: this.currentUserData.photoUrl,
            onlineStatus: true,
            memberInChannel: this.currentUserData.memberInChannel,
            activePrivateChats: this.currentUserData.activePrivateChats,
          }
        );
        resolve('Data added successfully');
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteCurrentData(coll: string, docId: any) {
    await deleteDoc(this.getCurrentDataDoc(coll, docId));
    this.currentSignUpData = [];
  }
}
