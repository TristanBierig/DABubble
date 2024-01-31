import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarHeaderMobileComponent } from './header-mobile.component';

describe('NavbarHeaderMobileComponent', () => {
  let component: NavbarHeaderMobileComponent;
  let fixture: ComponentFixture<NavbarHeaderMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarHeaderMobileComponent],
    });
    fixture = TestBed.createComponent(NavbarHeaderMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
