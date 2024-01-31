import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  showMenu: boolean = false;
  showMainChat: boolean = false;
  currentUserId:any;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public rs: ResponsiveService,
    public dialogService: DialogManagerService
    ){}

  ngOnInit(){
    this.authService.getCurrentUser();
  }

}
