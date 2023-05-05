import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, Subscription, concatMap, finalize, map, of, take, takeUntil, timer } from 'rxjs';
import { AuthenticationService } from '../shared/services/authentication.service';

class SixDigitFormControl extends FormControl {
  override setValue(value: any, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    switch (value?.toString().length) {
      case 6:
        super.setValue(value, options);
        break;

      case 7:
        super.setValue('', { ...options, emitModelToViewChange: true });
        break;

      default:
        super.setValue(value, options);
        break;
    }
  };
}
enum FormStep {
  USER = 1,
  CODE = 2,
  PASS = 3
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  timer = 120000;
  stopTimer = new Subject<string>();
  countdown = timer(0, 1000).pipe(
    takeUntil(this.stopTimer),
    map(() => {
      if (this.timer < 0) {
        this.stopTimer.next('stop');
        this.cd.detectChanges();
      }
      let minutes = Math.floor((this.timer % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((this.timer % (1000 * 60)) / 1000);
      this.timer -= 1000;
      return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    })
  );

  formSubscriptions = new Subscription();

  _formActive: FormStep = 1;
  set formActive(value: FormStep) {
    this._formActive = value;
    if (value == FormStep.CODE) {
      let counter: HTMLElement | null = null;
      this.stopTimer.next('start');
      this._ngZone.runOutsideAngular(() => {
        this.formSubscriptions.add(
          this.countdown.subscribe((response) => {
            if (counter) {
              counter.innerText = response;
            } else {
              counter = (this.host.nativeElement as HTMLElement).querySelector('#remaining-counter')!;
            }
          })
        );
      });
      this.formSubscriptions.add(
        this._ngZone.onStable.pipe(take(1)).subscribe(() => {
          counter = (this.host.nativeElement as HTMLElement).querySelector('#remaining-counter')!;
        })
      );
    }
    this.formSubscriptions.add(
      this._ngZone.onStable.pipe(take(1)).subscribe(() => {
        let temp = (this.host.nativeElement as HTMLElement).querySelector('input')!;
        if (value != FormStep.USER) {
          this.signinFormGroup.controls['passFormCtrl'].reset();
          this.signinFormGroup.controls['codeFormCtrl'].reset();
        }
        temp.focus();
      })
    );
  }

  get formActive() {
    return this._formActive;
  }

  buttonSpinnerSwitch = false;
  codeSentTo = '';

  signinFormGroup = new FormGroup({
    mobileFormCtrl: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern(/^(09)[0-9]{9}$/)]),
    codeFormCtrl: new SixDigitFormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
    passFormCtrl: new FormControl({ value: '', disabled: false }, [Validators.required]),
  });

  subscription = new Subscription();
  constructor(
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private host: ElementRef,
    private _ngZone: NgZone,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {
  }
  
  ngAfterViewInit(): void {
    this.formActive = FormStep.USER;
  }

  oneTimePassword() {
    this.buttonSpinnerSwitch = true;
    this.subscription.add(
      this.authenticationService.verificationStartChallange(this.codeSentTo).pipe(
        finalize(() => {
          this.buttonSpinnerSwitch = false;
        })
      ).subscribe({
        next: (response) => {
          this.timer = response.data.timerMS;
          this.formActive = FormStep.CODE;
        },
        error: (error) => {
          console.log(error);
          this.openSnackBar('خطایی رخ داد, بعد از دقایقی دوباره امتحان کنید.');
        }
      })
    );
  }

  resendCode() {
    if (this.buttonSpinnerSwitch) {
      return;
    }
    this.buttonSpinnerSwitch = true;
    this.subscription.add(
      this.authenticationService.verificationStartChallange(this.codeSentTo).pipe(
        finalize(() => {
          console.log('resendCode finalize');
          this.buttonSpinnerSwitch = false;
          this.cd.detectChanges();
        })
      ).subscribe({
        next: (response) => {
          this.timer = response.data.timerMS;
          this.codeSentTo = response.data.id
          this.formActive = (response.data.isPasswordSet) ? FormStep.PASS : FormStep.CODE;
        },
        error: (error) => {
          console.log(error);
          this.openSnackBar('خطایی رخ داد, بعد از دقایقی دوباره امتحان کنید.');
        }
      })
    );
  }

  ngOnInit(): void {
    this.signinFormGroup.controls['codeFormCtrl'].valueChanges.pipe(
      concatMap((response) => {
        if (response?.toString().length == 6) {
          this.signinFormGroup.controls['codeFormCtrl'].disable({ emitEvent: false });
          this.buttonSpinnerSwitch = true;
          return this.authenticationService.confirm(response);
        }
        return of(0);
      })
    ).subscribe({
      next: (response) => {
        if (response) {
          if (response.issuccess) {
            this.authenticationService.login(response);
            this.router.navigateByUrl('/home');
          } else {
            this.signinFormGroup.controls['codeFormCtrl'].enable({ emitEvent: false });
            this.signinFormGroup.controls['codeFormCtrl'].setErrors({ 'incorrect': true });
            this.buttonSpinnerSwitch = false;
            this.formActive = FormStep.CODE;
            this.openSnackBar('کد صحیح نیست, دوباره تلاش کنید.');
          }
        }
      },
      error: (error) => {
        this.signinFormGroup.controls['codeFormCtrl'].enable({ emitEvent: false });
        this.signinFormGroup.controls['codeFormCtrl'].setErrors({ 'incorrect': true });
        this.buttonSpinnerSwitch = false;
        this.formActive = FormStep.CODE;
        this.openSnackBar('خطایی رخ داد, بعد از دقایقی دوباره امتحان کنید.');
      }
    });
  }

  @HostListener('window:keyup.esc')
  handleKeyup() {
    this.formActive = FormStep.USER;
  }

  submitHandler() {
    this.signinFormGroup.setErrors({ 'incorrect': true });
    switch (this.formActive) {
      case FormStep.USER:
        if (!this.signinFormGroup.controls['mobileFormCtrl'].invalid) {
          this.signinFormGroup.controls['mobileFormCtrl'].disable({ emitEvent: false });
          this.buttonSpinnerSwitch = true;
          this.subscription.add(
            this.authenticationService.verificationStartChallange(this.signinFormGroup.controls['mobileFormCtrl'].value!).pipe(
              finalize(() => {
                this.signinFormGroup.controls['mobileFormCtrl'].enable({ emitEvent: false });
                this.buttonSpinnerSwitch = false;
              })
            ).subscribe({
              next: (response) => {
                this.timer = response.data.timerMS;
                this.codeSentTo = response.data.id
                this.formActive = (response.data.isPasswordSet) ? FormStep.PASS : FormStep.CODE;
              },
              error: (error) => {
                console.log(error);
                this.openSnackBar('خطایی رخ داد, بعد از دقایقی دوباره امتحان کنید.');
              }
            })
          );
        }
        break;
      case FormStep.PASS:
        if (!this.signinFormGroup.controls['passFormCtrl'].invalid) {
          this.signinFormGroup.controls['passFormCtrl'].disable({ emitEvent: false });
          this.buttonSpinnerSwitch = true;
          this.subscription.add(
            this.authenticationService.loginByPassword(this.signinFormGroup.controls['passFormCtrl'].value!).subscribe({
              next: (response) => {
                if (response.issuccess) {
                  this.authenticationService.login(response);
                  this.router.navigateByUrl('/home');
                } else {
                  this.signinFormGroup.controls['passFormCtrl'].enable({ emitEvent: false });
                  this.signinFormGroup.controls['passFormCtrl'].setErrors({ 'invalid': true });
                  this.formActive = FormStep.PASS;
                  this.buttonSpinnerSwitch = false;
                  this.openSnackBar('رمز عبور صحیح نیست, دوباره تلاش کنید.');
                }
              },
              error: (error) => {
                console.log(error);
                this.signinFormGroup.controls['passFormCtrl'].enable({ emitEvent: false });
                this.buttonSpinnerSwitch = false;
                this.openSnackBar('خطایی رخ داد, بعد از دقایقی دوباره امتحان کنید.');
              }
            })
          );
        }
        break;
      case FormStep.CODE:
        if (!this.signinFormGroup.controls['codeFormCtrl'].invalid) {
          this.signinFormGroup.controls['codeFormCtrl'].disable({ emitEvent: false });
          this.buttonSpinnerSwitch = true;
          this.subscription.add(
            this.authenticationService.confirm(this.signinFormGroup.controls['codeFormCtrl'].value!).subscribe({
              next: (response) => {
                if (response.issuccess) {
                  this.authenticationService.login(response);
                  this.router.navigateByUrl('/home');
                } else {
                  this.signinFormGroup.controls['codeFormCtrl'].enable({ emitEvent: false });
                  this.signinFormGroup.controls['codeFormCtrl'].setErrors({ 'invalid': true });
                  this.formActive = FormStep.CODE;
                  this.buttonSpinnerSwitch = false;
                  this.openSnackBar('کد صحیح نیست, دوباره تلاش کنید.');
                }
              },
              error: (error) => {
                console.log(error);
                this.signinFormGroup.controls['codeFormCtrl'].enable({ emitEvent: false });
                this.buttonSpinnerSwitch = false;
                this.openSnackBar('خطایی رخ داد, بعد از دقایقی دوباره امتحان کنید.*');
              }
            })
          );
        }
        break;
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      direction: 'rtl',
      duration: 7000
    });
  }

  ngOnDestroy(): void {
    this.formSubscriptions.unsubscribe();
    this.subscription.unsubscribe();
  }

}
