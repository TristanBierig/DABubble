import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss']
})

export class HeaderMobileComponent {
  @Input() parent!: string; 
  currentUser!: User;
  private currentUserIsDestroyed$ = new Subject<boolean>();

  constructor(
    private dialogService: DialogManagerService,
    private router: Router,
    private firestoreService: FirestoreService,
    public rs: ResponsiveService
    ) {    }
    
  ngOnInit(){
      this.setCurrentUser();
  }

  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
    this.currentUserIsDestroyed$.complete();
  }
  
  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((user: User) => {
      this.currentUser = user;
    } )
  }

  openMenu(){
    this.dialogService.showDialogProfilMenu();
  }

  navigateBack() {
    this.router.navigate(['/home/']);
  }
}
