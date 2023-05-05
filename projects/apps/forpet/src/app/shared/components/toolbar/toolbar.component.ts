import { Component, Input } from '@angular/core';
import { IBasket, Product } from '../../models/api-models';
import { BasketCalculation } from '../../services/basket.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

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
  // @Input() orderCalculation: BasketCalculation = {
  //   totalCount: '',
  //   totalDiscount: '',
  //   totalPureSum: '',
  //   totalSum: ''
  // };
}
