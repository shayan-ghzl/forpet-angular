import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-filter-menu',
  templateUrl: './product-filter-menu.component.html',
  styleUrls: ['./product-filter-menu.component.scss'],
  host: {
    'class': 'shadow',
    '[class.active]': 'open'
  }
})
export class ProductFilterMenuComponent implements OnChanges {

  @Input() open = true;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!(this.eRef.nativeElement.contains(event.target) || event.target.classList.contains('product-filter-menu-toggler'))) {
      this.open = false;
      this.openChange.emit(false);
    }
  }

  constructor(
    private eRef: ElementRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.open) {
      document.body.classList.add('overfolow-hidden');
    } else {
      document.body.classList.remove('overfolow-hidden');
    }
  }

}