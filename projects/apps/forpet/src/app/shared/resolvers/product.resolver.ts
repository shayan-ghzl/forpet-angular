import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, catchError, delay, of } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Good } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<{ data: Good } | string> {

  constructor(private apiService: ApiService, private router: Router) {
  }
  
  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ data: Good } | string> {
    let temp = this.router.getCurrentNavigation()?.extras.state;
    if (temp) {
      return of({ data: temp as Good })
    }
    return this.apiService.getGoodById(activatedRouteSnapshot.params['id']).pipe(
      catchError(() => {
        this.router.navigateByUrl('/home');
        return of('data not available at this time');
      })
    );
  }
}