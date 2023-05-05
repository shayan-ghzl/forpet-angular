import { Component, Input } from '@angular/core';
import { IBasket, Product } from '../../models/api-models';
import { BasketCalculation } from '../../services/basket.service';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent {

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
