import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { Good, IBasket, IBrandDto, IGoodGroupDto } from '../shared/models/api-models';
import { ApiService } from '../shared/services/api.service';
import { BasketService } from '../shared/services/basket.service';
import { OfflineStorageService } from '../shared/services/offline-storage.service';

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
  ) {
    basketService.getBasketById().subscribe();
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
    this.getGoods();
    this.getGoodGroups();
    this.getBrands();
  }

  getGoods() {
    let temp = localStorage.getItem('time') || '0';
    this.offlineStorageService.getItems('products').then((value: Good[]) => {
      if (!isNaN(+temp) && Math.abs(+temp - new Date().getTime()) < 3600000) {
        this.trendProducts = value;
        if (value.length != 0) {
          this.hasTrendProductsArrived = true;
          return;
        }
      }
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
        per_page: -1,
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
