import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSelectable]'
})
export class SelectableDirective {

  @HostListener('keydown.arrowdown', ['$event'])
  onArrowDownKeyDown(event: KeyboardEvent) {

    const row = <HTMLLIElement>event.currentTarget;
    const nextRow = this.findNextSelectableRow(row);

    if (nextRow) {
      nextRow.focus();
    }

    event.preventDefault();
  }

  @HostListener('keydown.arrowup', ['$event'])
  onArrowUpKeyDown(event: KeyboardEvent) {
    const row = <HTMLLIElement>event.currentTarget;
    const prevRow = this.findPrevSelectableRow(row);

    if (prevRow) {
      prevRow.focus();
    }

    event.preventDefault();
  }

  @HostListener('keydown.enter', ['$event'])
  onEnterKeyDown(event: KeyboardEvent) {
    (<HTMLLIElement>event.currentTarget).click();
  }

  hasClass(element: any, className: string): boolean {
    if (element && className) {
      if (element.classList) return element.classList.contains(className);
      else return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
    }

    return false;
  }

  findNextSelectableRow(row: HTMLLIElement): HTMLLIElement | null {
    let nextRow = <HTMLLIElement>row.nextElementSibling;
    if (nextRow) {
      if (this.hasClass(nextRow, 'suggestion-menu-item')) return nextRow;
      else return this.findNextSelectableRow(nextRow);
    } else {
      return null;
    }
  }

  findPrevSelectableRow(row: HTMLLIElement): HTMLLIElement | null {
    let prevRow = <HTMLLIElement>row.previousElementSibling;
    if (prevRow) {
      if (this.hasClass(prevRow, 'suggestion-menu-item')) return prevRow;
      else return this.findPrevSelectableRow(prevRow);
    } else {
      return null;
    }
  }


}
