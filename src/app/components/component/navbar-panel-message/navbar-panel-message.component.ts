import { Component, inject } from '@angular/core';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Chat } from 'src/app/models/chat.class';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-navbar-panel-message',
  templateUrl: './navbar-panel-message.component.html',
  styleUrls: ['./navbar-panel-message.component.scss']
})
export class NavbarPanelMessageComponent {
  firestore: Firestore = inject(Firestore);
  panelOpenState: boolean = false;
  currentUserId: any;
  currentUser!: User;
  subCurrentUser!: User;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  userInChatsArray: Chat[] = [];
  chatBetweenUserIds: string[] = [];
  chatUserData: User[] = [];

  cacheChatUserData!: User;

  
  constructor(
    private firestoreService: FirestoreService
  ){
    this.currentUserId = localStorage.getItem("currentUserId")
  }
  
  ngOnInit(){
    this.setCurrentUser();
    this.setChatUserData();
  }
  
  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
  }

  setChatUserData(){
    this.chatUserData = this.firestoreService.chatUserData;
    // .pipe(takeUntil(this.currentUserIsDestroyed$))
    // .subscribe((chatUser: []) => {
    //   this.chatUserData = chatUser;
    // } )
    // console.log('chat firestore Array: ', this.firestoreService.chatUserData);
    // console.log('chat userDataArray: ', this.chatUserData);
  }
  
  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((user: User) => {
      this.currentUser = user;
      // console.log('userData Chat: ', this.currentUser.memberInChannel);
    } )
  }

  rotateArrow() {
    const channelArrow: HTMLElement | null= document.getElementById(
      `directMessage--arrow_drop_down`
    );
    channelArrow?.classList.toggle('rotate');
  }
}
