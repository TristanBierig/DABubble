import { Injectable, OnInit, inject } from '@angular/core';
import { Message } from '../models/message.class';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { chatTypes } from '../interfaces/chats/types';
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
import { Unsubscribe } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnInit {
  firestore: Firestore = inject(Firestore);

  public leadingThreadMsg!: any;
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
    await this.createNewChatRecord('thread', this.chatRecordId, msgId);
    // await this.setLeadingMsg(msgId);
    this.router.navigate(['/thread/', msgId, this.channelId]);
  }

  openThread(msg: Message, channelId: string) {
    this.router.navigate(['/thread/', msg.id, channelId]);
  }

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
      console.log('LeadingMsg set as: ', docSnap.data());
      this.leadingThreadMsg = docSnap.data();
    }
  }

  async createNewChatRecord(
    hostType: chatTypes,
    targetId: string,
    chatRecordId: string,
  ) {
    const newChatRecordRef = doc(collection(this.firestore, 'chatRecords'));
    await setDoc(newChatRecordRef, {});

    switch (hostType) {
      case 'channel':
        this.saveChatRefInChannelCol(targetId, newChatRecordRef);
        break;

      case 'thread':
        this.saveChatRefInMsgAsThread(chatRecordId, targetId, newChatRecordRef);
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
    const targetRef = doc(
      this.firestore,
      'channels',
      targetId
    );
    await updateDoc(targetRef, {
      'chatRecord': newChatRecordRef.id,
    });
  }

  async saveChatRefInPrivateCol(
    targetId: string,
    newChatRecordRef: DocumentReference<DocumentData>
  ) {
    const targetRef = doc(
      this.firestore,
      'privateChat',
      targetId
    );
    await updateDoc(targetRef, {
      'chatRecord': newChatRecordRef.id,
    });
  }

  async navigateBack(src: chatTypes) {
    const msgThread = this.leadingThreadMsg.thread;

    if (src === 'thread' && msgThread.length === 0) {
      await this.deleteChatRecord(msgThread.id);
      console.log('before delete ref msg id is:', this.leadingThreadMsg.id);

      this.deleteMsgChatRecordRef(
        this.threadParentChatRecordId,
        this.leadingThreadMsg.id
      );
    }

    this.router.navigate(['/home/', this.channelId]);
  }

  setChatRecordId(chatRecordId: string) {
    this.chatRecordIdSubject.next(chatRecordId);
  }

  setThreadChatRecordId(chatRecordId: string) {
    this.threadChatRecordIdSubject.next(chatRecordId);
  }

  async deleteChatRecord(docId: string) {
    console.log(docId);

    await deleteDoc(doc(this.firestore, 'chatRecords', docId));
  }

  async deleteMsgChatRecordRef(docId: string, msgId: string) {
    const msgRef = doc(this.firestore, 'chatRecords', docId, 'messages', msgId);
    await updateDoc(msgRef, {
      'thread.id': '',
    });
  }

  async updateThreadMetaData() {
    console.log('Msg has been send in a thread');
    console.log(this.threadParentChatRecordId);
    console.log(this.leadingThreadMsg.id);
    const threadMetaRef = doc(
      this.firestore,
      'chatRecords',
      this.threadParentChatRecordId,
      'messages',
      this.leadingThreadMsg.id
    );
    console.log(threadMetaRef);

    await updateDoc(threadMetaRef, {
      'thread.lastAnswer': serverTimestamp(),
      'thread.length': increment(1),
    });

    this.setLeadingMsg(this.leadingThreadMsg.id, this.threadParentChatRecordId);
  }
}
