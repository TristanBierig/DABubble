import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Message } from '../models/message.class';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ChatTypes } from '../interfaces/chats/types';
import { Unsubscribe } from '@angular/fire/auth';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnInit, OnDestroy {
  firestore: Firestore = inject(Firestore);

  public leadingThreadMsg!: any;
  private leadingThreadMsgSubject = new BehaviorSubject(this.leadingThreadMsg);
  public leadingThreadMsg$ = this.leadingThreadMsgSubject.asObservable();
  public leadingThreadMsgId!: string;
  public channelId!: string;

  public chatRecordId!: string;
  public threadParentChatRecordId!: string;

  public chatRecord!: Message[];
  public threadChatRecord!: Message[];

  private chatRecordSubject = new BehaviorSubject<Message[]>(this.chatRecord);
  private threadChatRecordSubject = new BehaviorSubject<Message[]>(
    this.threadChatRecord
  );

  chatRecord$ = this.chatRecordSubject.asObservable();
  threadChatRecord$ = this.threadChatRecordSubject.asObservable();

  private chatRecordIdSubject = new Subject<string>();
  chatRecordIdChanged$ = this.chatRecordIdSubject.asObservable();

  private threadChatRecordIdSubject = new Subject<string>();
  threadChatRecordIdChanged$ = this.threadChatRecordIdSubject.asObservable();

  unsubChatRecord!: Unsubscribe;
  unsubThreadChatRecord!: Unsubscribe;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubChatRecord();
    this.unsubThreadChatRecord();
  }

  startSubChat(docId: string) {
    this.unsubChatRecord = this.subChatRecord(docId);
  }

  startSubThreadChat(docId: string) {
    this.unsubThreadChatRecord = this.subThreadChatRecord(docId);
  }

  subChatRecord(docId: string) {
    return onSnapshot(
      query(
        collection(this.firestore, 'chatRecords', docId, 'messages'),
        orderBy('sentAt')
      ),
      (docs: any) => {
        this.chatRecord = [];
        docs.forEach((doc: any) => {
          this.chatRecord.push(doc.data());
        });
        this.chatRecordSubject.next(this.chatRecord);
      }
    );
  }

  subThreadChatRecord(docId: string) {
    return onSnapshot(
      query(
        collection(this.firestore, 'chatRecords', docId, 'messages'),
        orderBy('sentAt')
      ),
      (docs: any) => {
        this.threadChatRecord = [];
        docs.forEach((doc: any) => {
          this.threadChatRecord.push(doc.data());
        });
        this.threadChatRecordSubject.next(this.threadChatRecord);
      }
    );
  }

  async startThreadFromChannel(
    msgId: string,
    channelId: string,
    chatRecordId: string
  ) {
    this.chatRecordId = chatRecordId;
    this.channelId = channelId;
    this.leadingThreadMsgId = msgId;
    await this.createNewChatRecord('thread', msgId, this.chatRecordId);
  }

  /**
   * This function sets the data of the message the thread has been started on
   * to display on the very top of the chatRecord
   *
   * @param msgId - Id of the message the thread has been started on
   * @param parentChatRecordId - Id of the chatRecord where the message is stored in
   */
  async setLeadingMsg(msgId: string, parentChatRecordId: string) {
    this.threadParentChatRecordId = parentChatRecordId;
    const docRef = doc(
      this.firestore,
      'chatRecords',
      this.threadParentChatRecordId,
      'messages',
      msgId
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.leadingThreadMsg = docSnap.data();
      this.leadingThreadMsgSubject.next(this.leadingThreadMsg);
    }
  }

  /**
   * This function creates a new chatRecord and takes several params
   * to determine where the reference of the new chatRecord needs to
   * be stored
   *
   * @param hostType - String of the type of channel the new chatRecord is referenced to
   * @param targetId - Id of the document where the reference of the chatRecord needs to be stored
   * @param {string} [chatRecordId] - Optional, just needed for threads to locate the specific message in a given chatRecord
   */
  async createNewChatRecord(
    hostType: ChatTypes,
    targetId: string,
    chatRecordId?: string
  ) {
    const newChatRecordRef = doc(collection(this.firestore, 'chatRecords'));
    await setDoc(newChatRecordRef, {
      type: hostType,
    });

    switch (hostType) {
      case 'channel':
        this.saveChatRefInChannelCol(targetId, newChatRecordRef);
        break;

      case 'thread':
        if (chatRecordId) {
          this.saveChatRefInMsgAsThread(
            chatRecordId,
            targetId,
            newChatRecordRef
          );
        }
        break;

      case 'private':
        this.saveChatRefInPrivateCol(targetId, newChatRecordRef);
        break;

      default:
        break;
    }
  }

  async saveChatRefInMsgAsThread(
    chatRecordId: string,
    targetId: string,
    newChatRecordRef: DocumentReference<DocumentData>
  ) {
    const targetRef = doc(
      this.firestore,
      'chatRecords',
      chatRecordId,
      'messages',
      targetId
    );
    await updateDoc(targetRef, {
      'thread.id': newChatRecordRef.id,
    });
  }

  async saveChatRefInChannelCol(
    targetId: string,
    newChatRecordRef: DocumentReference<DocumentData>
  ) {
    const targetRef = doc(this.firestore, 'channels', targetId);
    await updateDoc(targetRef, {
      chatRecord: newChatRecordRef.id,
    });
  }

  async saveChatRefInPrivateCol(
    targetId: string,
    newChatRecordRef: DocumentReference<DocumentData>
  ) {
    const targetRef = doc(this.firestore, 'privateChat', targetId);
    await updateDoc(targetRef, {
      chatRecord: newChatRecordRef.id,
    });
  }

  async navigateBack(src: ChatTypes) {
    const msgThread = this.leadingThreadMsg.thread;
    if (src === 'thread' && msgThread.length === 0) {
      await this.deleteChatRecord(msgThread.id);

      this.deleteMsgChatRecordRef(
        this.threadParentChatRecordId,
        this.leadingThreadMsg.id
      );
    }
  }

  setChatRecordId(chatRecordId: string) {
    this.chatRecordIdSubject.next(chatRecordId);
  }

  setThreadChatRecordId(chatRecordId: string) {
    this.threadChatRecordIdSubject.next(chatRecordId);
  }

  async deleteChatRecord(docId: string) {
    await deleteDoc(doc(this.firestore, 'chatRecords', docId));
  }

  async deleteMsgChatRecordRef(docId: string, msgId: string) {
    const msgRef = doc(this.firestore, 'chatRecords', docId, 'messages', msgId);
    await updateDoc(msgRef, {
      'thread.id': '',
    });
  }

  async updateThreadMetaData() {
    const threadMetaRef = doc(
      this.firestore,
      'chatRecords',
      this.threadParentChatRecordId,
      'messages',
      this.leadingThreadMsg.id
    );

    await updateDoc(threadMetaRef, {
      'thread.lastAnswer': serverTimestamp(),
      'thread.length': increment(1),
    });

    this.setLeadingMsg(this.leadingThreadMsg.id, this.threadParentChatRecordId);
  }

  async getUserDataFromPrivateChat(docId: string) {
    const docRef = doc(this.firestore, 'privateChat', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return undefined;
    }
  }

  openFile(url: string) {
    window.open(url, '_blank');
  }

  async updateMessage(chatRecordId: string, msg: Message, content: string) {
    const msgRef = doc(
      this.firestore,
      'chatRecords',
      chatRecordId,
      'messages',
      msg.id
    );
    if (!msg.file.url) {
      await updateDoc(msgRef, {
        message: content,
        'file.name': '',
        'file.type': '',
        'file.url': '',
      });
    } else {
      await updateDoc(msgRef, {
        message: content,
        'file.name': msg.file.name,
        'file.type': msg.file.type,
        'file.url': msg.file.url,
      });
    }
  }
}
