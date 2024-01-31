import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  isDesktop!:boolean;
  signInForm = new FormGroup({
    emailForm: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._*/+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
    ]),
    passwordForm: new FormControl('', [Validators.required]),
  });

  constructor(public authService: AuthService, public rs: ResponsiveService) {
    this.rs.isDesktop$.subscribe((val) => {
      if (val) {
        this.isDesktop = true;
      } else {
        this.isDesktop = false;
      }
    });
  }

  /**
   * Get the email input field from the form group to use form control
   *
   */
  get emailForm() {
    return this.signInForm.get('emailForm');
  }

  /**
   * Get the password input field from the form group to use form control
   *
   */
  get passwordForm() {
    return this.signInForm.get('passwordForm');
  }
}
