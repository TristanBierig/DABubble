import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddMemberToChannelComponent } from './dialog-add-member-to-channel.component';

describe('DialogAddMemberToChannelComponent', () => {
  let component: DialogAddMemberToChannelComponent;
  let fixture: ComponentFixture<DialogAddMemberToChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAddMemberToChannelComponent]
    });
    fixture = TestBed.createComponent(DialogAddMemberToChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
