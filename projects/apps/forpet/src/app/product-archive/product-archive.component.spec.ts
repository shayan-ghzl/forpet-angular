import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductArchiveComponent } from './product-archive.component';

describe('ProductArchiveComponent', () => {
  let component: ProductArchiveComponent;
  let fixture: ComponentFixture<ProductArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductArchiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
