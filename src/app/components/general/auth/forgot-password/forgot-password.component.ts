import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnDestroy {
  @ViewChild('email') email!: ElementRef;

  constructor(public authService: AuthService, public firestoreService: FirestoreService) {}


  ngOnDestroy(): void {
    this.authService.sendMailError = false;
  }


  forgotPasswordForm = new FormGroup({
    emailForm: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._*/+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
    ]),
  });

  /**
   * Get the password input field from the form group to use form control
   *
   */
  get emailForm() {
    return this.forgotPasswordForm.get('emailForm');
  }

  /**
   * Starts the forgot-password function in auth service and resets the password form field
   *
   * @param email - The email adress where the mail should be send to
   */
  async forgotPassword(email: string) {
    await this.authService.forgotPassword(email);
    this.forgotPasswordForm.reset();
    this.email.nativeElement = '';
  }
}
