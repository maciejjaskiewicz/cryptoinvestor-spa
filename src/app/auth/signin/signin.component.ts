import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  @ViewChild('loginForm') form: NgForm;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit() { }

  onKeyEnter() {
    if (this.form.valid) {
      this.login();
    }
  }

  login() {
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.loadingService.register();
    this.authService.login(email, password).subscribe(
      logged => { },
      error => {
        this.loadingService.resolve();
        this.openInvalidCredentialsDialog();
      }
    );
  }

  openInvalidCredentialsDialog() {
    this.dialogService.openConfirm({
      message: 'Invalid email or password. Try again.',
      disableClose: false,
      viewContainerRef: this.viewContainerRef,
      title: 'Invalid credentials',
      cancelButton: 'Ok',
      acceptButton: 'Sign Up',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.router.navigate(['/signup']);
      }
    });
  }
}
