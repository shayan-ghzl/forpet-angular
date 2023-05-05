import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  canActivate(): Observable<boolean> {
    if (!environment.useLoginAuth) {
      return of(true);
    }
    return this.authenticationService.getCurrentUser().pipe(
      map((value) => {
        if (value) {
          this.router.navigateByUrl('/home');
          return false;
        }
        return true;
      })
    );
  }

}
