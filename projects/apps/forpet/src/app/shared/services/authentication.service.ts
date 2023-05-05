import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IBasket, IUserDto } from '../models/api-models';

export type CurrentUser = 'pending' | 'rejected' | IUserDto;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // CurrentUser Store
  token = '';
  private currentUserSource = new BehaviorSubject<CurrentUser>('pending');
  getCurrentUser$: Observable<CurrentUser> = this.currentUserSource.asObservable().pipe(
    tap((value) => {
      // @ts-ignore
      if (value.token) { this.token = value.token; }
      else { this.token = ''; }
    }),
  );
  private setCurrentUser(currentUser: CurrentUser) {
    this.currentUserSource.next(currentUser);
  }


  mobileNumber = '';
  verificationType = 1;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /*
   - If it return Observable<false> means the user is not authenticated
     and if it return Observable<true> means the user is authenticated.
   - It also handles localStorage and also currentUser in the store.
  */

  getCurrentUser() {
    let temp = localStorage.getItem('ut');
    if (temp || this.token) {
      return this.http.get<any>(environment.apiUrl + 'Users/GetCurrentUser').pipe(
        tap((value) => {
          console.log(value, 'getCurrentUser');
        }),
        map((response) => {
          if (response.issuccess) {
            this.login(response);
            return true;
          }
          localStorage.removeItem('ut');
          this.setCurrentUser('rejected');
          return false;
        }),
        catchError(() => {
          this.setCurrentUser('rejected');
          return of(false);
        })
      );
    }
    return of(false);
  }

  verificationStartChallange(username: string, forceByCode = false) {
    return this.http.get<any>(environment.apiUrl + 'Users/VerificationStartChallange', { params: new HttpParams().append('username', username).append('forceByCode', forceByCode) }).pipe(
      tap((value) => {
        console.log(value);
        this.mobileNumber = value.data.id;
        this.verificationType = value.data.verificationType;
      })
    );
  }

  confirm(code: string) {
    return this.http.post<any>(environment.apiUrl + 'Users/Confirm', {
      "id": this.mobileNumber,
      "verificationCode": code,
      "verificationType": this.verificationType,
      "ipAddress": "",
      "expireDateTime": new Date(),
      "message": ""
    }).pipe(
      tap(console.log)
    );
  }

  loginByPassword(password: string) {
    return this.http.post<any>(environment.apiUrl + 'Users/LoginByPassword', {
      'username': this.mobileNumber,
      'password': password
    }).pipe(
      tap(console.log)
    );
  }

  logout() {
    localStorage.removeItem('ut');
    this.setCurrentUser('pending');
    this.router.navigateByUrl('/login');
  }

  login(response: any) {
    localStorage.setItem('ut', response.data.token);
    this.setCurrentUser(response.data);
  }

}