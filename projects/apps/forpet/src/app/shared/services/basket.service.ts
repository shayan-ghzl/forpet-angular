import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, of, take, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IBasket, Product } from '../models/api-models';

export type BasketCalculation = {
  totalCount: string;
  totalDiscount: string;
  totalPureSum: string;
  totalSum: string;
}

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  // basket orders list Store
  private ordersListSource = new BehaviorSubject<Product[]>(<Product[]>[]);
  getOrdersList$: Observable<Product[]> = this.ordersListSource.asObservable().pipe(
    tap(console.log)
  );

  addToBasket(product: Product | Product[]) {
    let temp = this.ordersListSource.value;
    temp = this.checkExistence(temp, product);
    this.ordersListSource.next(temp);
  }

  removeFromBasket(productId: string) {
    let temp = this.ordersListSource.value.filter(p => p.id !== productId);
    this.ordersListSource.next(temp);
  }

  private checkExistence(list: Product[], item: Product | Product[]) {
    if (Array.isArray(item)) {
      for (let node of item) {
        list = this.checkExistence(list, node);
      }
    } else {
      let foundIndex = list.findIndex(x => x.id === item.id);
      if (foundIndex > -1) {
        list[foundIndex] = item;
      } else {
        list.push(item);
      }
    }
    return list;
  }
  // ---------------------------
  // basket calculation Store
  private basketCalculationSource = new BehaviorSubject<BasketCalculation>(<BasketCalculation>{
    totalCount: '',
    totalDiscount: '',
    totalPureSum: '',
    totalSum: '',
  });
  getBasketCalculation$: Observable<BasketCalculation> = this.basketCalculationSource.asObservable().pipe(
    tap(console.log)
  );

  private setBasketCalculation(calculation: BasketCalculation) {
    this.basketCalculationSource.next(calculation);
  }
  // ---------------------------
  // IBasket full Store
  private iBasketSource = new BehaviorSubject<IBasket>(<any>null);
  getIBasket$: Observable<IBasket> = this.iBasketSource.asObservable().pipe(
    tap(console.log),
    filter(x => x != null),
  );

  private setIBasket(iBasket: IBasket) {
    this.iBasketSource.next(iBasket);
  }
  // ---------------------------

  _basketId!: string;
  set basketId(value: string) {
    this._basketId = value;
    localStorage.setItem("bi", value);
  }
  get basketId() {
    return this._basketId;
  }

  constructor(
    private http: HttpClient
  ) {
    this.basketId = localStorage.getItem('bi') || environment.emptyGuid;
  }

  getBasketById() {
    if (this.basketId !== environment.emptyGuid) {
      return this.http.get<IBasket>(environment.apiUrl + 'Basket/GetBasketById', { params: new HttpParams().append('id', this.basketId) }).pipe(
        take(1),
        tap(value => {
          this.basketId = value.id || environment.emptyGuid;
          this.setIBasket(value);
          this.addToBasket(value.basketItems);
          this.setBasketCalculation({
            'totalCount': value.totalCount,
            'totalDiscount': value.totalDiscount,
            'totalPureSum': value.totalPureSum,
            'totalSum': value.totalSum
          });
        }),
      );
    }
    return of({
      id: '',
      basketItems: [],
      totalCount: '',
      totalDiscount: '',
      totalPureSum: '',
      totalSum: '',
    }).pipe(
      take(1),
      tap(value => {
        this.basketId = value.id || environment.emptyGuid;
        this.setIBasket(value);
        this.addToBasket(value.basketItems);
        this.setBasketCalculation({
          'totalCount': value.totalCount,
          'totalDiscount': value.totalDiscount,
          'totalPureSum': value.totalPureSum,
          'totalSum': value.totalSum
        });
      }),
    );
  }

  updateBasket(product: Product) {
    return this.http.post<IBasket>(environment.apiUrl + 'Basket/UpdateBasket', {
      id: this.basketId,
      basketItem: product
    }).pipe(
      take(1),
      tap(value => {
        this.basketId = value.id || environment.emptyGuid;
        this.setIBasket(value);
        this.addToBasket(value.basketItems);
        this.setBasketCalculation({
          'totalCount': value.totalCount,
          'totalDiscount': value.totalDiscount,
          'totalPureSum': value.totalPureSum,
          'totalSum': value.totalSum
        });
      }),
    );
  }

  deleteBasket() {
    return this.http.delete<any>(environment.apiUrl + 'Basket/DeleteBasket', { params: new HttpParams().append('id', this.basketId) }).pipe(
      take(1),
      tap(value => {
        this.basketId = environment.emptyGuid;
        this.setIBasket(value);
        this.addToBasket([]);
        this.setBasketCalculation({
          'totalCount': '',
          'totalDiscount': '',
          'totalPureSum': '',
          'totalSum': ''
        });
      }),
    );
  }

}
