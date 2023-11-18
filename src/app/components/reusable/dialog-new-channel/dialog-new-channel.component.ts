import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-dialog-new-channel',
  templateUrl: './dialog-new-channel.component.html',
  styleUrls: ['./dialog-new-channel.component.scss']
})
export class DialogNewChannelComponent {
  setCurrentUser!:User;
  private currentUserIsDestroyed$ = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private navbarService: NavbarService, 
  ){}
  
    ngOnInit() {
    this.setCurrentUser();
  }

  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
  }

  setCurrentUser() {
    this.firestoreService.currentUser$
      .pipe(takeUntil(this.currentUserIsDestroyed$))
      .subscribe((user: User) => {
        this.currentUser = user;
        this.onlineStatus = user.onlineStatus;
      });
  }

  createChannel(){
    // this.firestoreService.addNewChannel(this.currentUserId);
    this.selectionUserIntoChannel();
  }

  selectionUserIntoChannel(){
    let radio = document.querySelector('input[name="addOption"]:checked');
    if(radio != null){
      if(radio.id == 'radioAllUser'){
        console.log('Add all User to Channel', 
        // this.createNewChannel.newChannelName, 
        // this.createNewChannel.newChannelDescription
        );

        this.renderAllUserinChannel();
      }else if(radio.id == 'radioSingleUser'){
        console.log('Add single User to Channel ', 
        // this.createNewChannel.newChannelName, 
        // this.createNewChannel.newChannelDescription
        );

      }
    }else{
      console.log('You have not selected anything');
    }
  }

  renderAllUserinChannel(){
    
  }
  
  hideUserSearchbarNewChannel(){
    let showContainerSearch: HTMLElement | null = document.getElementById('new-channel-search-user');
    showContainerSearch?.classList.remove('show');
  }
  
  showUserSearchbarNewChannel(){
    let showContainerSearch: HTMLElement | null = document.getElementById('new-channel-search-user');
    showContainerSearch?.classList.add('show');
  }

  closeMenu() {
    this.navbarService.menuSlideDown();
  }
}
