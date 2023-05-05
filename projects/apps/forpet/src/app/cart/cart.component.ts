import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { BasketService } from '../shared/services/basket.service';
import { IBasket, Product } from '../shared/models/api-models';
import { FormGroup } from '@angular/forms';
import { FormGenerator } from '../shared/components/form-generator/form-generator.component';
import { environment } from '../../environments/environment';
import { FakeApiService } from '../shared/services/fake-api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

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

  basketUpdateSubscription!: Subscription;
  addToBasket(basketItem: Product) {
    if (environment.useFakeApi) {
      this.fakeApiService.fakeUpdateBasket(basketItem);
    } else {
      this.basketUpdateSubscription?.unsubscribe();
      this.basketUpdateSubscription = this.basketService.updateBasket(basketItem).subscribe();
    }
  }

  removeProduct(product: Product) {
    if (confirm(`Are You Sure ? ${product.goodName}`)) {
      if (environment.useFakeApi) {
        this.fakeApiService.fakeUpdateBasket({
          ...product,
          count: 0
        });
      } else {
        this.subscription.add(
          this.basketService.updateBasket({
            ...product,
            count: 0
          }).subscribe()
        );
      }
    }
  }

  couponFormTemplate: FormGenerator[] = [
    {
      fieldAttribute: {
        type: 'text',
        placeholder: 'کد تخفیف',
        formControlName: 'couponCode',
        value: '',
        isDisabled: false,
      },
      label: 'کد تخفیف',
      labelStar: false,
      button: {
        label: 'اعمال کوپن',
        submitForm: true,
        class: 'btn-success btn-sm',
        clickHandler: () => { }
      },
      containerClass: 'form-field',
      fieldClass: 'form-control-sm',
      validationUi: false,
      validation: {
        isRequired: true,
        minLength: 4,
        maxLength: 24,
      }
    }

  ];

  submitHandler(formGroup: FormGroup) {
    console.log(formGroup.value);
  }

  identify(index: number, item: Product) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.basketUpdateSubscription?.unsubscribe();
    this.subscription.unsubscribe();
  }
}
