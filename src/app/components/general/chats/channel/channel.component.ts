import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AvatarConfig, ChatTypes } from 'src/app/interfaces/chats/types';
import { Channel } from 'src/app/models/channel.class';
import { Message } from 'src/app/models/message.class';
import { User } from 'src/app/models/user.class';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit, OnDestroy {
  private componentIsDestroyed$ = new Subject<boolean>();

  public currentUser!: User;
  public currentChannel!: Channel;
  public currentChannelID!: string;
  public chatRecordId!: string;
  private catchAttempts: number = 0;
  public chatRecordLength!: number;
  public mainType!: ChatTypes;

  public privateChatOpponentUser!: User;
  public privateChatAvatarConfig!: AvatarConfig;

  constructor(
    private fireService: FirestoreService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    public rs: ResponsiveService
  ) {
    this.route.queryParamMap.subscribe((p: any) => {
      this.currentChannelID = p['params'].channelID;
      const routeSnap = this.route.snapshot.paramMap.get('type')!;
      if (
        routeSnap === 'channel' ||
        routeSnap === 'private' ||
        routeSnap === 'thread'
      ) {
        this.mainType = routeSnap;
      }
      this.setChatRecordId('channels');
      this.setCurrentUser();
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.componentIsDestroyed$.next(true);
    this.componentIsDestroyed$.complete();
  }

  setCurrentUser() {
    this.fireService.currentUser$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((user: User) => {
        this.currentUser = user;
        if (this.mainType === 'private') {
          this.setChatPartner();
        }
      });
  }

  /**
   * This function gets the url channel id of wether a channel or private chat
   * and searches for the corresponding document id of the chatRecord. On first
   * attempt it searches through the channels and then through the private Chats.
   *
   * @param colId - String literal to define in which collection in the Firestore
   *                the document should be searched for
   */
  async setChatRecordId(colId: 'channels' | 'privateChat') {
    if (this.currentChannelID) {
      await this.fireService
        .getSingleDoc(colId, this.currentChannelID)
        .then((doc: any) => {
          if (doc.chatRecord) {
            this.chatRecordId = doc.chatRecord;
            this.currentChannel = doc;
            this.chatService.setChatRecordId(doc.chatRecord);
            this.catchAttempts = 0;
          } else {
            console.log('Document holds no chatRecord id to reference to!');
          }
        })
        .catch(() => {
          if (this.catchAttempts === 0) {
            this.catchAttempts++;
            this.setChatRecordId('privateChat');
          }
        });
    }
  }

  /**
   * This function only gets triggerd when the chat-sub-header is set for a private-chat.
   * This gets determined by the URL Type. Then it gets the doc id of the private chat
   * from the channelId in the URL and looks for the other User the chat is meant to be with.
   * Validates if its the own Chat or with another user and proceeds to set the corresponding
   * Chat partner in the privateChatOpponentUser variable.
   *
   */
  setChatPartner() {
    this.chatService
      .getUserDataFromPrivateChat(this.currentChannelID)
      .then((privateChat: DocumentData | undefined) => {
        if (this.currentUser && privateChat) {
          // Private Chat Document exists
          const chatBetween: string[] = privateChat['chatBetween'];
          if (privateChat['id'] === this.currentUser.id) {
            // Private Chat with yourself
            this.privateChatOpponentUser = this.currentUser;
          } else {
            // Private Chat with another User
            const currentUserIndex = chatBetween.indexOf(this.currentUser.id);
            chatBetween.splice(currentUserIndex, 1);
            this.fireService
              .getUserDoc('user', chatBetween[0])
              .then((user: User | undefined) => {
                if (user) {
                  this.privateChatOpponentUser = user;
                }
              });
          }
        }
      });
  }

  startThread(msg: Message) {
    this.chatService.startThreadFromChannel(
      msg.id,
      this.currentChannel.id,
      this.currentChannel.chatRecord
    );
  }

  setChatRecordLength(length: number) {
    this.chatRecordLength = length;
  }
}
