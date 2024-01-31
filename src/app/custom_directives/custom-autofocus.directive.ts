import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[customAutofocus]',
})
export class CustomAutofocusDirective implements AfterContentInit {
  @Input() public appAutoFocus!: boolean;

  constructor(private el: ElementRef) {}

  public ngAfterContentInit(): void {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 200);
  }
}
