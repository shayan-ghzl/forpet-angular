import { Component, Input, OnDestroy } from '@angular/core';
import { IBasket, Product } from '../../models/api-models';
import { BasketCalculation, BasketService } from '../../services/basket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mini-cart-popup',
  templateUrl: './mini-cart-popup.component.html',
  styleUrls: ['./mini-cart-popup.component.scss'],
})
export class MiniCartPopupComponent implements OnDestroy {

  @Input() iBasket: IBasket = {
    id: '',
    basketItems: [],
    totalCount: '',
    totalDiscount: '',
    totalPureSum: '',
    totalSum: '',
  };
  @Input() hasResponseArrived = false;
  // @Input() ordersList: Product[] = [];
  // @Input()   `: BasketCalculation = {
  //   totalCount: '',
  //   totalDiscount: '',
  //   totalPureSum: '',
  //   totalSum: ''
  // };
  subscription = new Subscription();
  constructor(private basketService: BasketService) { }

  removeProduct(product: Product) {
    if (confirm(`Are You Sure ? ${product.goodName}`)) {
      this.subscription.add(
        this.basketService.updateBasket({
          ...product,
          count: 0
        }).subscribe()
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
