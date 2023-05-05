import { Component, OnInit } from '@angular/core';
import { Good, IBasket } from '../shared/models/api-models';
import { Subscription, finalize } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { BasketService } from '../shared/services/basket.service';

@Component({
  selector: 'app-product-archive',
  templateUrl: './product-archive.component.html',
  styleUrls: ['./product-archive.component.scss']
})
export class ProductArchiveComponent implements OnInit{

  productFilterShow = false;

  products: Good[] = [];
  hasProductsArrived = false;

  iBasket: IBasket = {
    id: '',
    basketItems: [],
    totalCount: '',
    totalDiscount: '',
    totalPureSum: '',
    totalSum: '',
  };

  subscription = new Subscription();


  constructor(
    private apiService:ApiService,
    private basketService:BasketService,
  ){}

  ngOnInit(): void {
    this.subscription.add(
      this.basketService.getIBasket$.subscribe(
        value => {
          this.iBasket = value;
        }
      )
    );
    this.getGoods();
  }

  getGoods() {
      this.subscription.add(
        this.apiService.getGoods({
          page: 1,
          per_page: 10,
        }).pipe(
          finalize(() => {
            this.hasProductsArrived = true;
          }),
        ).subscribe({
          next: (response) => {
            this.products = response.data.data;
          },
          error: (error) => {
            console.log(error, 'error');
          }
        })
      );
 
  }

  identify(index: number, item: any) {
    return item.id;
  }
}
