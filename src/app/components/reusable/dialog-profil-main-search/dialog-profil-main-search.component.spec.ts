import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProfilMainSearchComponent } from './dialog-profil-main-search.component';

describe('DialogProfilMainSearchComponent', () => {
  let component: DialogProfilMainSearchComponent;
  let fixture: ComponentFixture<DialogProfilMainSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogProfilMainSearchComponent]
    });
    fixture = TestBed.createComponent(DialogProfilMainSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
