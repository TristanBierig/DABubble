import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-new-chat',
  templateUrl: './dialog-new-chat.component.html',
  styleUrls: ['./dialog-new-chat.component.scss'],
})
export class DialogNewChatComponent {
  @ViewChild('searchbarUser') searchbarUser!: ElementRef;
  public showCloseAnimation: boolean = false;
  currentUser!: User;
  allUsers!: User[];
  filteredUser: User[] = [];
  selectedUser: User[] = [];
  userSelected: boolean = true;
  isAlreadyInChat: boolean = false;
  windowWidth: number = window.innerWidth;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  private allUsersIsDestroyed$ = new Subject<boolean>();
  public isDesktop!: boolean;
  public isMobile!: boolean;
  public isTablet!: boolean;
  private componentIsDestroyed$ = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialogService: DialogManagerService,
    public rs: ResponsiveService,
    private router: Router
  ) {
    this.rs.isDesktop$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((val) => {
        this.isDesktop = val;
      });

      this.rs.isTablet$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((val) => {
        this.isTablet = val;
      });

    this.rs.isMobile$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((val) => {
        this.isMobile = val;
      });
  }

  ngOnInit() {
    this.setCurrentUser();
    this.setAllUser();
  }

  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
    this.allUsersIsDestroyed$.next(true);
  }

  setCurrentUser() {
    this.firestoreService.currentUser$
      .pipe(takeUntil(this.currentUserIsDestroyed$))
      .subscribe((user: any) => {
        this.currentUser = user;
      });
  }

  setAllUser() {
    this.firestoreService.allUsers$
      .pipe(takeUntil(this.allUsersIsDestroyed$))
      .subscribe((users: any) => {
        this.allUsers = users;
      });
  }

  //<<<<<<<<<<<<<<<< search user >>>>>>>>>>>>
  searchForUser() {
    let searchbarValue = this.searchbarUser.nativeElement.value.toLowerCase();
    this.filteredUser = [];
    if (searchbarValue === null || searchbarValue === '') {
      this.filteredUser = [];
    } else {
      this.filterForUser(searchbarValue);
    }
  }

  filterForUser(inputName: string) {
    this.allUsers.forEach((user) => {
      let userName = user.name.toLowerCase();
      if (this.isCheckedInput(inputName, userName)) {
        this.filteredUser.push(user);
      }
    });
  }

  isCheckedInput(inputName: string, userName: string) {
    return (
      userName.includes(inputName) && !userName.includes(this.currentUser.name)
    );
  }

  //<<<<<<<<<<<<<<<< selected add/remove user >>>>>>>>>>>>
  selectUser(user: User) {
    this.selectedUser.push(user);
    this.filteredUser = [];
    this.searchbarUser.nativeElement.value = null;
    this.userSelected = false;
  }

  removeUser() {
    this.selectedUser = [];
    this.userSelected = true;
    this.isAlreadyInChat = false;
  }

  submitNewChat() {
    this.isAlreadyInChat = false;
    this.checkIsAlreadyInChat();
    if (this.isAlreadyInChat) {
      console.error('DABubble: chat already exists');
    } else {
      this.firestoreService.createNewChat(this.selectedUser[0]);
      if (this.isTablet || this.isMobile) {
        this.router.navigateByUrl(
          `/chat/private?channelID=${this.firestoreService.newChatRefId}`
        );
      }
      if (this.isDesktop) {
        this.router.navigateByUrl(
          `/home(channel:chat/private)?channelID=${this.firestoreService.newChatRefId}`
        );
      }
      this.removeUser();
      this.dialogService.showDialogNewChat();
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    }
  }

  checkIsAlreadyInChat() {
    let selectedUserId = this.selectedUser[0].id;
    let allChatsUserData = this.firestoreService.chatUserData;
    allChatsUserData.forEach((user) => {
      if (user.id == selectedUserId) {
        this.isAlreadyInChat = true;
      }
    });
  }

  //<<<<<<<<<<<<<<<< manage dialog >>>>>>>>>>>>
  closeDialogNewChat() {
    if (this.windowWidth < 1370.02) {
      this.showCloseAnimation = true;
      this.closeAnimation();
    } else {
      this.dialogService.showDialogNewChat();
    }
    this.removeUser();
    this.clearIputField();
  }

  clearIputField() {
    let inputSearchbarUser: any = document.getElementById('searchbar-newChat');
    if (inputSearchbarUser != null) {
      inputSearchbarUser.value = null;
      this.filteredUser = [];
    }
  }

  closeAnimation() {
    if (this.showCloseAnimation) {
      setTimeout(() => {
        this.showCloseAnimation = false;
        this.dialogService.showDialogNewChat();
      }, 500);
    }
  }
}
