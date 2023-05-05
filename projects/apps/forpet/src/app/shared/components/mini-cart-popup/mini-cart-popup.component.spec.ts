import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCartPopupComponent } from './mini-cart-popup.component';

describe('MiniCartPopupComponent', () => {
  let component: MiniCartPopupComponent;
  let fixture: ComponentFixture<MiniCartPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniCartPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniCartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
