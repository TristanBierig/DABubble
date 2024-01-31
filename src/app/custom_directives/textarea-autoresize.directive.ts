import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[customTextareaAutoresize]',
})
export class TextareaAutoresizeDirective implements OnInit {
  constructor(private el: ElementRef) {}

  @HostListener(':input')
  onInput() {
    this.resize();
  }

  ngOnInit(): void {
    if (this.el.nativeElement.scrollHeight) {
      setTimeout(() => this.resize());
    }
  }

  resize() {
    this.el.nativeElement.style.height = 0;
    this.el.nativeElement.style.height =
      this.el.nativeElement.scrollHeight + 'px';
  }
}
