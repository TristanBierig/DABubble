import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnDestroy, OnInit {
  isDesktop!:boolean;
  signUpForm = new FormGroup({
    nameForm: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-ZöÖüÜäÄß -]+$'),
    ]),
    emailForm: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._*/+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
    ]),
    passwordForm: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z]).*$/),
      Validators.required,
      this.requireUniqueCharacters(4),
      Validators.required,
    ]),
    checkboxForm: new FormControl(),
  });

  constructor(public authService: AuthService, public firestoreService: FirestoreService, public rs: ResponsiveService) {
    this.rs.isDesktop$.subscribe((val) => {
      if (val) {
        this.isDesktop = true;
      } else {
        this.isDesktop = false;
      }
    });
  }

  ngOnInit(): void {
    this.firestoreService.emailAlreadyExist = false;
  }

  ngOnDestroy(): void {
    this.firestoreService.emailAlreadyExist = false;
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


  getCheckboxValue() {
    if (!this.checkboxForm?.value) {
      this.authService.dataError = false;
    } else {
      this.authService.dataError = true;
    }
  }

  /**
   * Get the name input field from the form group to use form control
   *
   */
  get nameForm() {
    return this.signUpForm.get('nameForm');
  }

  /**
   * Get the email input field from the form group to use form control
   *
   */
  get emailForm() {
    return this.signUpForm.get('emailForm');
  }

  /**
   * Get the password input field from the form group to use form control
   *
   */
  get passwordForm() {
    return this.signUpForm.get('passwordForm');
  }

  /**
   * Get the checkbox from the form group to use form control
   *
   */
  get checkboxForm() {
    return this.signUpForm.get('checkboxForm');
  }
}
