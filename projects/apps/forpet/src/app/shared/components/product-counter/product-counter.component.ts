import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-counter',
  templateUrl: './product-counter.component.html',
  styleUrls: ['./product-counter.component.scss']
})
export class ProductCounterComponent implements OnChanges {

  @Input() count = 0;
  @Output() countChange: EventEmitter<number> = new EventEmitter();
  @Input() max = 99;
  @Input() romoveOnZero = false;
  @Input() isDisabled = false;
  disableAdd = false;
  disableSubtract = false;
  subtractionLimit = 1;

  @HostListener('dblclick', ['$event'])
  noDoubleTapZoom(e: MouseEvent) {
    e.preventDefault();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.romoveOnZero) {
      this.subtractionLimit = 0;
    }
    if (this.subtractionLimit < this.max) {
      if (this.count >= this.max) {
        this.disableAdd = true;
        if (this.count != this.max) {
          this.count = this.max;
          this.countChange.emit(this.count);
        }
      } else if (this.count <= this.subtractionLimit) {
        this.disableSubtract = true;
        if (this.count != this.subtractionLimit) {
          this.count = this.subtractionLimit;
          this.countChange.emit(this.count);
        }
      }
    } else {
      this.disableAdd = this.disableSubtract = true;
      this.count = this.subtractionLimit;
      this.countChange.emit(this.count);
    }
  }

  addition() {
    if (!this.disableAdd) {
      this.count += 1;
      this.countChange.emit(this.count);
      if (this.count >= this.max) {
        this.disableAdd = true;
      } else {
        this.disableSubtract = false;
      }
    }
  }

  subtraction() {
    if (!this.disableSubtract) {
      this.count -= 1;
      this.countChange.emit(this.count);
      if (this.count <= this.subtractionLimit) {
        this.disableSubtract = true;
      } else {
        this.disableAdd = false;
      }
    }
  }

}
