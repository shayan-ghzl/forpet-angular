import { Component, Input } from '@angular/core';
import { Good } from '../../models/api-models';
import { BasketService } from '../../services/basket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {

  @Input() product!: Good;
  @Input() productCount = 0;

  constructor(private basketService: BasketService) { }

  basketUpdateSubscription!: Subscription;
  addToBasket(count: number) {
    if (!this.product.userGroupPrice?.price) {
      return;
    }
    if (count == 1) {
      this.productCount = 1;
    }
    this.basketUpdateSubscription?.unsubscribe();
    // question: why we are doing this instead of sending this.product ?
    // answer: in basket we do not have Good model, it is Product model so we are conver Good to Product below 
    let temp = {
      id: this.product.id,
      goodName: (this.product.goodParent?.name || '') + ' ' + (this.product.brand?.name || ''),
      goodPageUrl: this.product.pageUrl,
      brandName: this.product.brand?.name || '',
      price: this.product.userGroupPrice!.price,
      discount: this.product.userGroupPrice!.discount,
      finalPrice: this.calculatePriceAfterDiscount(this.product.userGroupPrice!.price, this.product.userGroupPrice!.discount, 1),
      count: count,
      imageUrl: (this.product.goodImages.length) ? this.product.goodImages[0].imageUrl : '',
      goodType: 0,
      technicalCode: this.product.technicalCode
    };

    this.basketUpdateSubscription = this.basketService.updateBasket(temp).subscribe();
  }

  calculatePriceAfterDiscount(price: number, discount: number, quantity: number): number {
    if (discount <= 100) {
      return Math.round(price * quantity - ((price * quantity * discount) / 100));
    }
    else {
      return Math.round(quantity * (price - discount));
    }
  }

}
