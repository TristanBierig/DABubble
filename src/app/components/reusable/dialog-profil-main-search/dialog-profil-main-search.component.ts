import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogProfilEditComponent } from '../dialog-profil-edit/dialog-profil-edit.component';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';


@Component({
  selector: 'app-dialog-profil-main-search',
  templateUrl: './dialog-profil-main-search.component.html',
  styleUrls: ['./dialog-profil-main-search.component.scss']
})
export class DialogProfilMainSearchComponent {
  onlineStatus: boolean = false;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialogManagerService: DialogManagerService,
    public dialogRef: MatDialogRef<DialogProfilEditComponent>,
    public dialog: MatDialog
  ) {}

  ngOnDestroy() {
    this.dialogManagerService.selectedUser = '';
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  openDialogProfilEdit() {
    this.dialog.open(DialogProfilEditComponent, {
      width: '350px',
    });
    this.onNoClick();
  }
}
