import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IBasket } from '../../shared/models/api-models';
import { ApiService } from '../../shared/services/api.service';
import { BasketService } from '../../shared/services/basket.service';
import { FakeApiService } from '../../shared/services/fake-api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  // --------------------------------
  iBasket: IBasket = {
    id: '',
    basketItems: [],
    totalCount: '',
    totalDiscount: '',
    totalPureSum: '',
    totalSum: '',
  };
  // for mini-cart we have three states: 
  // 1: pending (initial)
  // 2: list fulfilled (response)
  // 3: list empty (response)
  hasResponseArrived = false;
  // --------------------------------
  subscription = new Subscription();
  
  constructor(
    private apiService: ApiService,
    private fakeApiService: FakeApiService,
    private basketService: BasketService,
  ) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.basketService.getIBasket$.subscribe(
        value => {
          this.iBasket = value;
          this.hasResponseArrived = true;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
