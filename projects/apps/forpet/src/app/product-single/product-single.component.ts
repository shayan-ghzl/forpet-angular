import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Good } from '../shared/models/api-models';
import { SwiperOptions } from 'swiper';
import { BasketService } from '../shared/services/basket.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.scss']
})
export class ProductSingleComponent implements OnInit, OnDestroy{

  config: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 0,
    threshold: 10,
    observer: true,
    observeParents: true,
    breakpoints: {
      768: {
        pagination: { clickable: false },
      },
    }
  };
  product!: Good;
  productCount = 0;
  subscription = new Subscription();
  zoomMode = 'hover';
  enableLens = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private basketService: BasketService,
    private breakpointObserver: BreakpointObserver,
  ) {
    
  }

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.data.subscribe(params => {
        this.product = params['product'].data;
        console.log(this.product);
      })
    );
    this.subscription.add(
      this.basketService.getIBasket$.subscribe((response) => {
        this.productCount = response.basketItems.find(p => p.id == this.product.id)?.count || 0;
      })
    );
    this.subscription.add(
      this.breakpointObserver.observe(['(max-width: 992px)']).subscribe((state: BreakpointState) => {
          this.enableLens = !state.matches;
      })
    );
  }


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
    } else {
      return Math.round(quantity * (price - discount));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.basketUpdateSubscription?.unsubscribe();
  }
}
