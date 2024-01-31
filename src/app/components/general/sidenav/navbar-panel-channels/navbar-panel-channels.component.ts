import { Component } from '@angular/core';
import { takeUntil ,  Subject } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { AuthService } from 'src/app/services/auth.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-navbar-panel-channels',
  templateUrl: './navbar-panel-channels.component.html',
  styleUrls: ['./navbar-panel-channels.component.scss']
})

export class NavbarPanelChannelsComponent {
  panelOpenState: boolean = false;
  currentUserId: any;
  currentUser!: User;
  subCurrentUser!: User;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  memberInChannelsArray: Channel[] = [];

  // unsubCurrentUser!: Unsubscribe;


  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialogService: DialogManagerService,
  ){
    this.currentUser = this.firestoreService.currentUser;
  }

  ngOnInit(){
    this.setCurrentUser();
    this.setMemberInChannelArray();
  }
  
  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
  }

  setMemberInChannelArray(){
    this.firestoreService.channelsArray$
    .pipe(takeUntil(this.currentUserIsDestroyed$)) // destroy subscribe
    .subscribe((channel: any) => {
      this.memberInChannelsArray = channel;
    });
  }

  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((user: User) => {
      this.currentUser = user;
    } )
  }

  rotateArrow() {
    const channelArrow: HTMLElement | null = document.getElementById(
      `channel--arrow_drop_down`
    );
    channelArrow?.classList.toggle('rotate');
  }

  openDialogNewChannel(){
    this.dialogService.showDialogAddChannel();
  }
}
