import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';
import { Subject, takeUntil } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DialogProfilComponent } from '../dialog-profil/dialog-profil.component';

@Component({
  selector: 'app-dialog-profil-edit',
  templateUrl: './dialog-profil-edit.component.html',
  styleUrls: ['./dialog-profil-edit.component.scss'],
})
export class DialogProfilEditComponent {
  currentUser!: User;
  userName!:string;
  userEmail!:string;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  updateUserForm = new FormGroup({
    nameForm: new FormControl('', [
      // Validators.required,
      Validators.pattern('^[a-zA-ZöÖüÜäÄß -]+$'),
    ]),
    emailForm: new FormControl('', [
      // Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._*/+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
    ]),
  })

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialogRef: MatDialogRef<DialogProfilComponent>,
    ) {}

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
        });
    }

    async updateCurrentUserData(userName: string, userEmail:string){
      this.checkInputUserName(userName);
      this.checkInputUserEmail(userEmail);
      await this.firestoreService.updateCurrentUserData(this.currentUser.id, this.userName, this.userEmail);
      this.dialogRef.close();
    }

    checkInputUserName(userName: string){
      if(userName === '' || undefined){
        this.userName = this.currentUser.name;
      }else(
        this.userName = userName
      )
    }

    checkInputUserEmail(userEmail: string){
      if(userEmail === '' || undefined){
        this.userEmail = this.currentUser.email
      }else(
        this.userEmail = userEmail
      )
    }

  /** Get the input field from the form group to use form control */
  get nameForm() {
    return this.updateUserForm.get('nameForm');
  }

  get emailForm() {
    return this.updateUserForm.get('emailForm');
  }
  /** */
    
    onNoClick() {
      this.dialogRef.close();
    }
}
