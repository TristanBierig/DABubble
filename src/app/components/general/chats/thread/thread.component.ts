import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { Message } from 'src/app/models/message.class';
import { User } from 'src/app/models/user.class';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  public currentThreadId!: string;
  public parentChatRecordId!: string;

  public chatRecordId!: string;
  public currentChannel!: Channel;
  private currentChannelId!: string;
  public leadingMsg!: Message;
  public leadingMsgId!: string;
  public currentUser!: User;

  private componentIsDestroyed$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private fireService: FirestoreService,
    private chatService: ChatService,
    public rs: ResponsiveService
  ) {
    this.setCurrentUser();
    this.setCurrentChannel();
  }

  ngOnInit(): void {}

  setCurrentUser() {
    this.fireService.currentUser$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((user: User) => {
        this.currentUser = user;
      });
  }

  /**
   * This function caches the channel-object in which the thread has been
   * started and the corresponding message is stored
   *
   */
  async setCurrentChannel() {
    this.route.queryParamMap.subscribe(async (p: any) => {
      let channelId = p['params'].channelID;

      if (channelId) {
        this.chatService.channelId = channelId;
        await this.fireService
          .getSingleDoc('channels', channelId)
          .then((doc: any) => {
            this.currentChannel = doc;
            this.parentChatRecordId = doc.chatRecord;
            this.setChatRecordId();
          });
      }
    });
  }

  /**
   * Because the chatRecord for a thread is nested in the corresponding
   * message itself (Document of a subcollection), it needs to be accessed
   * in this certain way.
   *
   */
  setChatRecordId() {
    this.route.queryParamMap.subscribe(async (p: any) => {
      let msgId = p['params'].msgID;
      if (msgId) {
        await this.fireService
          .getSingleSubDoc(this.currentChannel.chatRecord, msgId)
          .then((doc: any) => {
            this.chatRecordId = doc.thread.id;
            this.chatService.setThreadChatRecordId(doc.thread.id);
            this.setLeadingMsg(msgId);
          });
      }
    });
  }

  async setLeadingMsg(msgId: string) {
    this.chatService.chatRecordId = this.chatRecordId;
    if (msgId) {
      await this.chatService.setLeadingMsg(msgId, this.parentChatRecordId);
    }

    this.chatService.leadingThreadMsg$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((msg: Message) => {
        this.leadingMsg = msg;
      });
  }

  loadFile(url: string) {
    this.chatService.openFile(url);
  }
}
