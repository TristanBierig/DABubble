import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewChannelComponent } from './dialog-new-channel.component';

describe('DialogNewChannelComponent', () => {
  let component: DialogNewChannelComponent;
  let fixture: ComponentFixture<DialogNewChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogNewChannelComponent]
    });
    fixture = TestBed.createComponent(DialogNewChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
