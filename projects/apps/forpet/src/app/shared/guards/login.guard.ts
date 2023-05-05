import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  canActivate(): Observable<boolean> {
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
