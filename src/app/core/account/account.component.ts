import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TdDialogService } from '@covalent/core';
import { TdLoadingService } from '@covalent/core';
import { MatSnackBar } from '@angular/material';
import { AuthService } from './../../auth/auth.service';
import { UserService } from './../../shared/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @ViewChild('updateForm') form: NgForm;
  userProfile: any;

  constructor(
    private authservice: AuthService,
    private userService: UserService,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.userProfile = this.userService.getLocaleProfile();
    this.formatDate();
  }

  update() {
    this.loadingService.register();
    const firstName = this.form.value.firstName;
    const lastName = this.form.value.lastName;
    const gender = this.form.value.gender;
    this.userService.updateProfile(firstName, lastName, gender).subscribe(
      (data) => {
        this.userProfile = this.userService.getLocaleProfile();
        this.formatDate();
        this.loadingService.resolve();
        this.openSnackBar('User updated!');
      },
      (err) => {
        this.loadingService.resolve();
        this.openErrorDialog();
      }
    );
  }

  formatDate() {
    this.userProfile.createdAt = new Date(this.userProfile.createdAt * 1000);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  openErrorDialog(): void {
    this.dialogService.openAlert({
      message: 'Something went wrong. Try again.',
      disableClose: false,
      viewContainerRef: this.viewContainerRef,
      title: 'Error',
      closeButton: 'Close',
    });
  }

}
