import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPanelChannelsComponent } from './navbar-panel-channels.component';

describe('NavbarPanelChannelsComponent', () => {
  let component: NavbarPanelChannelsComponent;
  let fixture: ComponentFixture<NavbarPanelChannelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarPanelChannelsComponent]
    });
    fixture = TestBed.createComponent(NavbarPanelChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
