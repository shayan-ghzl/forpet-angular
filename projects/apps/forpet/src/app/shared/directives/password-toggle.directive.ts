import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPasswordToggleCtrl]'
})
export class PasswordToggleCtrlDirective {
  @Input('appPasswordToggleCtrl') inputElement!: PasswordToggleDirective;
  @HostListener("click")
  toggle() {
    this.inputElement.isShow = !(this.inputElement.isShow);
  }
}

@Directive({
  selector: '[appPasswordToggle]',
  exportAs: 'exportPasswordToggle'
})
export class PasswordToggleDirective {
  isShow = false;
}
