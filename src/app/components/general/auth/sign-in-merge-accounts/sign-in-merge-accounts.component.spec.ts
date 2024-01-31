import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInMergeAccountsComponent } from './sign-in-merge-accounts.component';

describe('SignInMergeAccountsComponent', () => {
  let component: SignInMergeAccountsComponent;
  let fixture: ComponentFixture<SignInMergeAccountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignInMergeAccountsComponent]
    });
    fixture = TestBed.createComponent(SignInMergeAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
