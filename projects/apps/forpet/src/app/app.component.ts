import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  isBrowser: boolean = this._platformId
    ? isPlatformBrowser(this._platformId)
    : typeof document === 'object' && !!document;

  TRIDENT: boolean = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);

  IOS: boolean =
    this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);

  ANDROID: boolean = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;

  routerLoading = false;
  subscription = new Subscription();

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.IOS || this.ANDROID) {
      document.body.classList.add('mobile');
      if (this.IOS) {
        document.body.classList.add('ios');
      }
      if (this.ANDROID) {
        document.body.classList.add('android');
      }
    }

    this.subscription.add(
      this.router.events.subscribe({
        next: (response) => {
          if (response instanceof NavigationStart) {
            this.routerLoading = true;
          }
          if (response instanceof NavigationEnd) {
            this.routerLoading = false;
          }
          // Set loading state to false in both of the below events to hide the spinner in case a request fails
          if (response instanceof NavigationCancel) {
            this.routerLoading = false;
          }
          if (response instanceof NavigationError) {
            this.routerLoading = false;
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
