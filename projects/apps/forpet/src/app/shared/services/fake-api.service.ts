import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, of, take, tap, timeout } from 'rxjs';
import { BasketService } from './basket.service';
import { environment } from '../../../environments/environment';
import { IBasket } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class FakeApiService {

  constructor(
    private http: HttpClient,
    private basketService: BasketService,
  ) { }

  getFakeGoodById() {
    return this.http.get('./assets/fake-requests/GetGoodById.txt', { responseType: 'text' }).pipe(
      delay(800),
      take(1),
      timeout(13000),
      map(p => JSON.parse(p))
    );
  }

  getFakeGoods() {
    return this.http.get('./assets/fake-requests/GetSomeGoods.txt', { responseType: 'text' }).pipe(
      delay(2500),
      take(1),
      timeout(13000),
      map(p => JSON.parse(p))
    );
  }

  getFakeBasketById() {
    return this.http.get('./assets/fake-requests/GetBasketById.txt', { responseType: 'text' }).pipe(
      delay(2500),
      take(1),
      timeout(13000),
      map(p => JSON.parse(p)),
      tap((value) => this.basketService.basketToStore(value)),
    );
  }
}
