import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProfilMenuComponent } from './dialog-profil-menu.component';

describe('DialogProfilMenuComponent', () => {
  let component: DialogProfilMenuComponent;
  let fixture: ComponentFixture<DialogProfilMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogProfilMenuComponent]
    });
    fixture = TestBed.createComponent(DialogProfilMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
