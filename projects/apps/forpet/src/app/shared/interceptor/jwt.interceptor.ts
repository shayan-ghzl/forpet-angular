import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!environment.useFakeApi) {
      const token = localStorage.getItem('ut');
      if (this.authenticationService.token || token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.authenticationService.token || token}`
          }
        });
      } else {
        this.router.navigateByUrl('/login');
      }
    }
    return next.handle(request);
  }

}
