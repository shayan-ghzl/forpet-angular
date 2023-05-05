import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layouts/layout/layout.component';
import { LoginComponent } from './login/login.component';
import { ProductSingleComponent } from './product-single/product-single.component';
import { ProductResolver } from './shared/resolvers/product.resolver';
import { AuthenticationGuard } from './shared/guards/authentication.guard';
import { LoginGuard } from './shared/guards/login.guard';
import { AuthenticationService } from './shared/services/authentication.service';
import { map, of } from 'rxjs';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductArchiveComponent } from './product-archive/product-archive.component';
import { environment } from '../environments/environment';

const loginGuardCanActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if (!environment.useLoginAuth) {
    return of(true);
  }
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  return authenticationService.getCurrentUser().pipe(
    map((value) => {
      if (value) {
        router.navigateByUrl('/home');
        return false;
      }
      return true;
    })
  );
}

const AuthGuardCanActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if (!environment.useLoginAuth) {
    return of(true);
  }
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  return authenticationService.getCurrentUser().pipe(
    map((value) => {
      if (!value) {
        router.navigateByUrl('/login');
        return false;
      }
      return true;
    })
  );
}

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'product-archive',
        component: ProductArchiveComponent,
      },
      {
        path: 'product-category',
        component: ProductCategoryComponent,
      },
      {
        path: 'product/:id',
        component: ProductSingleComponent,
        resolve: { product: ProductResolver }
      },
      {
        path: 'product/:id/:seo',
        component: ProductSingleComponent,
        resolve: { product: ProductResolver }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
