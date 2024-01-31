import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ResponsiveService } from './services/responsive.service';
import { DialogManagerService } from './services/dialog-manager.service';
import { FirestoreService } from './services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'DABubble';

  // Auth gets instantiated to keep data from Fireservice
  // after manually reload of the page
  constructor(
    public auth: AuthService,
    public firestoreService: FirestoreService,
    public rs: ResponsiveService,
    public dialogService: DialogManagerService,
    public router: Router
  ) {}

  toggleNavbar() {
    this.dialogService.showNavbar();
  }
}
