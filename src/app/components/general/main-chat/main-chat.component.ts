import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { Message } from 'src/app/models/message.class';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  private componentIsDestroyed$ = new Subject<boolean>();
  public currentUser: User;
  public currentChannel!: Channel;
  public chatRecord!: Message[];
  public selectedMsg!: Message | null;
  public today: Date = new Date();

  constructor(
    private fireService: FirestoreService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef
  ) {
    this.currentUser = this.fireService.currentUser;
  }

  ngOnInit() {
    this.setChatRecordId();
  }

  ngAfterViewChecked() {
    // Prevents initial scroll-state on chat div to throw err
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.fireService.unsubChatRecord();
    this.componentIsDestroyed$.next(true);
    this.componentIsDestroyed$.complete();
  }

  async setChatRecordId() {
    const channelId = this.route.snapshot.paramMap.get('id');
    if (channelId) {
      await this.fireService
        .getSingleDoc('channels', channelId)
        .then((doc: any) => {
          this.currentChannel = doc;
          this.loadChatRecord();
        });
    }
  }

  loadChatRecord() {
    this.fireService.startSubChat(this.currentChannel.chatRecord);
    this.fireService.singleChatRecord$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((chat: Message[]) => {
        this.chatRecord = chat;
        console.log('Messages recieved from service. ', chat);
      });
  }





  openThread(msg: Message, event: any) {
    if (msg != this.selectedMsg) {
      event.stopPropagation();
    }
    console.log('OpenThread');
  }

  toggleMsgMenu(msg: Message) {
    if (this.selectedMsg == msg) {
      this.selectedMsg = null;
    } else {
      this.selectedMsg = msg;
    }
  }

  /**
   * This function validates wether or not the current message is the first
   * one of the day. Returns boolean to render the given Date-Pill to the template
   *
   * @param msg - current message from ngFor Loop
   * @param i - current index of message from ngFor Loop
   */
  isFirstMsgOfDay(msg: Message, i: number): boolean {
    if (i > 0) {
      const currentMsgDate = msg.sentAt.toDate().toDateString();
      const prevMsgDate = this.chatRecord[i - 1].sentAt.toDate().toDateString();
      return currentMsgDate != prevMsgDate;
    } else {
      return false;
    }
  }
}
