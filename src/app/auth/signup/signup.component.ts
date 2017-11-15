import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef,
    private loadingService: TdLoadingService
  ) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'email': new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(100)
      ], this.emailInUse.bind(this)),
      'username': new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      'passwords': new FormGroup({
        'password': new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100)
        ]),
        'cpassword': new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100)
        ])
      }, this.passwordsEquality)
    });
  }

  onKeyEnter() {
    if (this.signupForm.valid) {
      this.submit();
    }
  }

  submit() {
    this.loadingService.register();
    const email = this.signupForm.get('email').value;
    const username = this.signupForm.get('username').value;
    const password = this.signupForm.get('passwords.password').value;
    this.authService.register(email, username, password).subscribe(
      registered => {
        if (registered) {
          this.signupForm.reset();
          this.loadingService.resolve();
          this.openSuccessDialog();
        }
      },
      error => {
        this.loadingService.resolve();
        this.openErrorDialog();
      }
    );
  }

  passwordsEquality(control: AbstractControl): {[s: string]: boolean} {
    const password = control.get('password').value;
    const cpassword = control.get('cpassword').value;

    if (password === cpassword) {
      return null;
    }
    control.get('cpassword').setErrors({ 'passwordsEquality': false });
    return { 'passwordsEquality': false };
  }

  emailInUse(control: FormControl): Promise<any> | Observable<any> {
    const email = control.value;
    if (!email || !this.emailRegexp.test(email)) { return null; }

    const promise = new Promise<any>((resolve, reject) => {
      this.authService.emailInUse(email).subscribe(
        inUse => {
          if (inUse) {
            resolve({'emailInUse': true});
          }
          resolve(null);
        },
        error => { resolve(null); }
      );
    });
    return promise;
  }

  openSuccessDialog() {
    this.dialogService.openConfirm({
      message: 'Your account was successfully created.',
      disableClose: false,
      viewContainerRef: this.viewContainerRef,
      title: 'Success',
      cancelButton: 'Ok',
      acceptButton: 'Sign In',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.router.navigate(['/signin']);
      }
    });
  }

  openErrorDialog() {
    this.dialogService.openAlert({
      message: 'Something went wrong. Try again.',
      disableClose: false,
      viewContainerRef: this.viewContainerRef,
      title: 'Error',
      closeButton: 'Ok',
    });
  }
}
