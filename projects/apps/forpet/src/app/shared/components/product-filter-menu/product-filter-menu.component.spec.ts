import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilterMenuComponent } from './product-filter-menu.component';

describe('FilterMenuComponent', () => {
  let component: ProductFilterMenuComponent;
  let fixture: ComponentFixture<ProductFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFilterMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
