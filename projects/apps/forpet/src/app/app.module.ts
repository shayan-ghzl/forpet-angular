import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layouts/layout/layout.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProductSingleComponent } from './product-single/product-single.component';
import { BlogSingleComponent } from './blog-single/blog-single.component';
import { BlogArchiveComponent } from './blog-archive/blog-archive.component';
import { ProductArchiveComponent } from './product-archive/product-archive.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DropdownCtrlDirective, DropdownDirective } from './shared/directives/dropdown.directive';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { BrandingComponent } from './shared/components/branding/branding.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { MiniCartPopupComponent } from './shared/components/mini-cart-popup/mini-cart-popup.component';
import { AccountPopupComponent } from './shared/components/account-popup/account-popup.component';
import { CartComponent } from './cart/cart.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SearchFormComponent } from './shared/components/search-form/search-form.component';
import { SelectableDirective } from './shared/directives/selectable.directive';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { EmptyMessageComponent } from './shared/components/empty-message/empty-message.component';
import { CheckProductCountPipe } from './shared/pipes/check-product-count.pipe';
import { SwiperModule } from 'swiper/angular';
import { ProductCounterComponent } from './shared/components/product-counter/product-counter.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IrCurrencyPipe } from './shared/pipes/ir-currency.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGeneratorComponent } from './shared/components/form-generator/form-generator.component';
import { PasswordToggleCtrlDirective, PasswordToggleDirective } from './shared/directives/password-toggle.directive';
import { FormGeneratorValidationPipe } from './shared/pipes/form-generator-validation.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtInterceptor } from './shared/interceptor/jwt.interceptor';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { BlogCategoryComponent } from './blog-category/blog-category.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { ProductFilterMenuComponent } from './shared/components/product-filter-menu/product-filter-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    HomeComponent,
    ProductSingleComponent,
    BlogSingleComponent,
    BlogArchiveComponent,
    ProductArchiveComponent,
    DropdownDirective,
    DropdownCtrlDirective,
    ToolbarComponent,
    BrandingComponent,
    NavbarComponent,
    MiniCartPopupComponent,
    AccountPopupComponent,
    CartComponent,
    FooterComponent,
    SearchFormComponent,
    SelectableDirective,
    ProductCardComponent,
    EmptyMessageComponent,
    CheckProductCountPipe,
    ProductCounterComponent,
    IrCurrencyPipe,
    FormGeneratorComponent,
    PasswordToggleDirective,
    PasswordToggleCtrlDirective,
    FormGeneratorValidationPipe,
    LoadingComponent,
    ProductCategoryComponent,
    BlogCategoryComponent,
    PaginationComponent,
    ProductFilterMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    SwiperModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgxImageZoomModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
