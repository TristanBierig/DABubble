import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRecordComponent } from './chat-record.component';

describe('ChatRecordComponent', () => {
  let component: ChatRecordComponent;
  let fixture: ComponentFixture<ChatRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRecordComponent]
    });
    fixture = TestBed.createComponent(ChatRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
