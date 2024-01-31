import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSubHeaderComponent } from './chat-sub-header.component';

describe('ChatSubHeaderComponent', () => {
  let component: ChatSubHeaderComponent;
  let fixture: ComponentFixture<ChatSubHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatSubHeaderComponent]
    });
    fixture = TestBed.createComponent(ChatSubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
