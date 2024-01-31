import { Component, OnDestroy } from '@angular/core';
import { confirmPasswordReset } from '@angular/fire/auth';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnDestroy {
  passwordsSimilar = false;
  oobCode!: string;
  newPassword!: string;
  finishedReset = false;
  unexpectedError = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.oobCode = this.route.snapshot.queryParams['oobCode'] || null;
  }

  ngOnDestroy(): void {
    this.unexpectedError = false;
  }

  resetPasswordForm = new FormGroup({
    password1Form: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z]).*$/),
      Validators.required,
      this.requireUniqueCharacters(4),
      Validators.required,
    ]),
    password2Form: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z]).*$/),
      Validators.required,
      this.requireUniqueCharacters(4),
      Validators.required,
    ]),
  });

  /**
   * Get the first password input field from the form group to use form control
   *
   */
  get password1Form() {
    return this.resetPasswordForm.get('password1Form');
  }

  /**
   * Get the second password input field from the form group to use form control
   *
   */
  get password2Form() {
    return this.resetPasswordForm.get('password2Form');
  }

  /**
   * This function works as a validator for the form controls and counts the used character
   *
   * @param minCount - The number of the characters they should be use at least
   *
   */
  requireUniqueCharacters(minCount: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const uniqueCharacters = new Set(control.value);
        if (uniqueCharacters.size < minCount) {
          return { requireUniqueCharacters: true };
        }
      }
      return null;
    };
  }

  resetPassword() {
    confirmPasswordReset(this.authService.auth, this.oobCode, this.newPassword)
      .then(() => {
        this.finishedReset = true;
        this.resetPasswordForm.reset();
        this.passwordsSimilar = false;
        setTimeout(() => {
          this.finishedReset = false;
          this.router.navigate(['']);
        }, 4000);
      })
      .catch(() => {
        this.unexpectedError = true;
      });
  }

  checkPasswords(password1: string, password2: string) {
    if (password1 == password2) {
      this.passwordsSimilar = true;
      this.newPassword = password1;
    } else {
      this.passwordsSimilar = false;
    }
  }
}
