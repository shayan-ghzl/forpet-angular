import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { Good, IBasket, IBrandDto, IGoodGroupDto } from '../shared/models/api-models';
import { ApiService } from '../shared/services/api.service';
import { BasketService } from '../shared/services/basket.service';
import { OfflineStorageService } from '../shared/services/offline-storage.service';
import { FakeApiService } from '../shared/services/fake-api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  // --------------------------------
  // ordersList: Product[] = [];
  // orderCalculation: BasketCalculation = {
  //   totalCount: '',
  //   totalDiscount: '',
  //   totalPureSum: '',
  //   totalSum: ''
  // };
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
  trendProducts: Good[] = [];
  hasTrendProductsArrived = false;
  // --------------------------------
  categories: IGoodGroupDto[] = [];
  hasCategoriesArrived = false;
  // --------------------------------
  brands: IBrandDto[] = [];
  hasBrandsArrived = false;
  // --------------------------------

  config: SwiperOptions = {
    navigation: false,
    threshold: 12,
    pagination: false,
    freeMode: true,
    slidesPerView: 1.2,
    spaceBetween: 10,
    centeredSlides: true,
    breakpoints: {
      357: {
        slidesPerView: 1.5,
        spaceBetween: 15,
        centeredSlides: true,
      },
      500: {
        slidesPerView: 2.2,
        spaceBetween: 15,
        centeredSlides: true,
      },
      670: {
        slidesPerView: 3.2,
        spaceBetween: 20,
        centeredSlides: false,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
        centeredSlides: false,
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 24,
        centeredSlides: false,
      }
    }
  };
  categorySliderConfig: SwiperOptions = {
    navigation: false,
    pagination: false,
    freeMode: true,
    threshold: 12,
    slidesPerView: 'auto',
    spaceBetween: 0,
  };

  subscription = new Subscription();
  constructor(
    private apiService: ApiService,
    private basketService: BasketService,
    private offlineStorageService: OfflineStorageService,
    private fakeApiService: FakeApiService,
  ) {
    if (environment.useFakeApi) {
      fakeApiService.getFakeBasketById().subscribe();
    } else {
      basketService.getBasketById().subscribe();
    }
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


    if (environment.useFakeApi) {
      this.getFakeGoods();
    } else {
      this.getGoods();
    }
    this.getGoodGroups();
    this.getBrands();

  }

  getFakeGoods() {
    this.subscription.add(
      this.fakeApiService.getFakeGoods().pipe(
        finalize(() => {
          this.hasTrendProductsArrived = true;
        }),
      ).subscribe({
        next: (response) => {
          console.log(response);
          this.trendProducts = response.data.data;
        },
        error: (error) => {
          console.log(error, 'error');
        }
      })
    );
  }

  getGoods() {
    console.log('start getGoods');
    let temp = localStorage.getItem('time') || '0';
    this.offlineStorageService.getItems('products').then((value: Good[]) => {
      console.log('start offlineStorageService getGoods');
      if (!isNaN(+temp) && Math.abs(+temp - new Date().getTime()) < 3600000) {
        this.trendProducts = value;
        if (value.length != 0) {
          this.hasTrendProductsArrived = true;
          return;
        }
      }
      console.log('start request getGoods');
      this.subscription.add(
        this.apiService.getGoods({
          page: 1,
          per_page: 10,
        }).pipe(
          finalize(() => {
            this.hasTrendProductsArrived = true;
          }),
        ).subscribe({
          next: (response) => {
            console.log(response);
            this.offlineStorageService.addItems('products', <Good[]>response.data.data).then((value) => {
              console.log(value, 'offlineStorageService addItems');
              localStorage.setItem('time', new Date().getTime().toString());
            });
            this.trendProducts = response.data.data;
          },
          error: (error) => {
            console.log(error, 'error');
          }
        })
      );
    });
  }

  getGoodGroups() {
    this.subscription.add(
      this.apiService.getGoodGroups().pipe(
        finalize(() => {
          this.hasCategoriesArrived = true;
        })
      ).subscribe({
        next: (response) => {
          this.categories = response.data;
          this.offlineStorageService.addItems('categories', <IGoodGroupDto[]>response.data).then((value) => {
            console.log(value, 'offlineStorageService addItems');
          });
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  getBrands() {
    this.subscription.add(
      this.apiService.getBrands({
        page: 1,
        per_page: 4,
      }).pipe(
        finalize(() => {
          this.hasBrandsArrived = true;
        })
      ).subscribe({
        next: (response) => {
          this.brands = response.data.data;
          this.offlineStorageService.addItems('brands', <IBrandDto[]>response.data.data).then((value) => {
            console.log(value, 'offlineStorageService addItems');
          });
          // create a file and saving response----------
          let object = JSON.stringify(this.brands);
          const blob = new Blob([object], { type: 'text/plain' });
          const url = window.URL.createObjectURL(blob);
          // this one:
          // window.open(url);
          // or this one:
          const link = document.createElement("a");
          link.href = url;
          link.download = "getBrands.txt";
          // enable or disable switch here:
          // link.click();
          URL.revokeObjectURL(link.href);
          // -------------------------------------------
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  identify(index: number, item: any) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
