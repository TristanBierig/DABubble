import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { ChatService } from 'src/app/services/chat.service';
import { AvatarConfig } from 'src/app/interfaces/chats/types';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogChannelMemberComponent } from '../../dialogs/dialog-channel-member/dialog-channel-member.component';
import { DialogAddMemberToChannelComponent } from '../../dialogs/dialog-add-member-to-channel/dialog-add-member-to-channel.component';
import { DialogChannelMenuComponent } from '../../dialogs/dialog-channel-menu/dialog-channel-menu.component';

@Component({
  selector: 'app-chat-sub-header',
  templateUrl: './chat-sub-header.component.html',
  styleUrls: ['./chat-sub-header.component.scss'],
})
export class ChatSubHeaderComponent implements OnInit, OnChanges, OnDestroy {
  rs: ResponsiveService = inject(ResponsiveService);
  fireService: FirestoreService = inject(FirestoreService);
  @Input() type!: string;
  @Input() channel!: Channel;
  @Input() privateChatOpponentUser!: User;
  @Input() privateChatAvatarConfig!: AvatarConfig;

  private componentIsDestroyed$ = new Subject<boolean>();

  public currentUser!: User;
  public isDesktop!: boolean;
  public isMobile!: boolean;

  constructor(private chatService: ChatService, public dialog: MatDialog) {
    this.rs.isDesktop$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((val) => {
        this.isDesktop = val;
      });

    this.rs.isMobile$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((val) => {
        this.isMobile = val;
      });
  }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  ngOnChanges() {
    if (this.channel && this.type === 'channel') this.loadChannelMember();
  }

  ngOnDestroy() {
    this.componentIsDestroyed$.next(true);
    this.componentIsDestroyed$.complete();
  }

  setCurrentUser() {
    this.fireService.currentUser$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((user: User) => {
        this.currentUser = user;
      });
  }

  loadChannelMember() {
    this.fireService.startSubChannelMember(this.channel.id);
  }

  openMemberDialog() {
    this.dialog.open(DialogChannelMemberComponent, {
      data: this.fireService.channelMember,
    });
  }

  openAddMemberDialog() {
    this.dialog.open(DialogAddMemberToChannelComponent, {
      width: '430px',
    });
  }

  openChannelMenuDialog() {
    if (!this.isMobile) {
      this.dialog.open(DialogChannelMenuComponent, {
        data: this.channel,
        width: '750px',
      });
    } else {
      this.dialog.open(DialogChannelMenuComponent, {
        data: this.channel,
        panelClass: 'mobile__channel-menu-container',
        height: '100svh',
        width: '100%',
      });
    }
  }

  navigateBack(): void {
    this.chatService.navigateBack('thread');
  }
}
