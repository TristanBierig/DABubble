import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPanelMessageComponent } from './navbar-panel-message.component';

describe('NavbarPanelMessageComponent', () => {
  let component: NavbarPanelMessageComponent;
  let fixture: ComponentFixture<NavbarPanelMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarPanelMessageComponent]
    });
    fixture = TestBed.createComponent(NavbarPanelMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
