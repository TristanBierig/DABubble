import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewChatComponent } from './dialog-new-chat.component';

describe('DialogNewChatComponent', () => {
  let component: DialogNewChatComponent;
  let fixture: ComponentFixture<DialogNewChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogNewChatComponent]
    });
    fixture = TestBed.createComponent(DialogNewChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
