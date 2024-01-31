import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChannelMenuComponent } from './dialog-channel-menu.component';

describe('DialogChannelMenuComponent', () => {
  let component: DialogChannelMenuComponent;
  let fixture: ComponentFixture<DialogChannelMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogChannelMenuComponent]
    });
    fixture = TestBed.createComponent(DialogChannelMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
