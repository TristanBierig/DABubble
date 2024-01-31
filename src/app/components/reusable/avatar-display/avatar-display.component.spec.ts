import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarDisplayComponent } from './avatar-display.component';

describe('AvatarDisplayComponent', () => {
  let component: AvatarDisplayComponent;
  let fixture: ComponentFixture<AvatarDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarDisplayComponent]
    });
    fixture = TestBed.createComponent(AvatarDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
