import { Component, OnInit, ViewChild, OnDestroy, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { TdMediaService, TdLoadingService, TdDialogService } from '@covalent/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './../auth/auth.service';
import { UserService } from './../shared/user.service';
import { PortfolioService } from './portfolio/portfolio.service';
import { DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
  providers: [DatePipe, UpperCasePipe]
})
export class CoreComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav;
  portfolios: any;
  subscription: Subscription;
  portfolioChangedSub: Subscription;
  userEmail: string;
  triggerWidth = 'xs';
  navMode = 'side';
  currency = 'USD';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private portfolioService: PortfolioService,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef,
    private mediaService: TdMediaService
  ) { }

  ngOnInit() {
    this.setSideNav();
    this.watchScreen();

    const profile = this.userService.getLocaleProfile();
    this.userEmail = profile.email;
    this.getUserPortfolios();
    this.loadingService.resolveAll();

    this.portfolioChangedSub = this.portfolioService.portfolioChanged.subscribe(
      () => this.getUserPortfolios()
    );
  }

  changeCurrencyToUSD() {
    this.currency = 'USD';
  }

  changeCurrencyToPLN() {
    this.currency = 'PLN';
  }

  logout() {
    this.dialogService.openConfirm({
      message: 'Are you sure?',
      disableClose: false,
      viewContainerRef: this.viewContainerRef,
      title: 'Logout',
      cancelButton: 'No',
      acceptButton: 'Yes',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.authService.logout();
      }
    });
  }

  onCreateNewPortfolio() {
    this.dialogService.openPrompt({
      message: 'In this window you can create new portfolio. Please use unique name.',
      disableClose: false,
      viewContainerRef: this.viewContainerRef,
      title: 'Create new portfolio',
      value: 'New portfolio',
      cancelButton: 'Cancel',
      acceptButton: 'Create',
    }).afterClosed().subscribe((name: string) => {
      if (name) {
        this.createNewPortfolio(name);
      }
    });
  }

  createNewPortfolio(name: string) {
    this.portfolioService.createNewPortfolio(name).subscribe(
      (response) => {
        this.getUserPortfolios();
      },
      (err) => {
        const errorBody = JSON.parse(err._body);
        if (errorBody.code === 'portfolio_name_in_use') {
          this.openAlertDialog('Portfolio name in use', `${errorBody.message} Please use another name.`);
        } else {
          this.openAlertDialog('Error', 'Something went wrong. Try again later.');
        }
       }
    );
  }

  getUserPortfolios() {
    this.loadingService.register('navListLoading');

    this.portfolioService.getPortfolios().subscribe(
      (data) => {
        this.portfolios = data;
        this.loadingService.resolve('navListLoading');
      },
      (err) => {
        this.loadingService.resolve('navListLoading');
      }
    );
  }

  openAlertDialog(title: string, message: string): void {
    this.dialogService.openAlert({
      message: message,
      disableClose: false,
      viewContainerRef: this.viewContainerRef,
      title: title,
      closeButton: 'Close',
    });
  }

  watchScreen() {
    this.subscription = this.mediaService.registerQuery(this.triggerWidth).subscribe((matches: boolean) => {
      this.setSideNav();
    });
  }

  setSideNav() {
    const isSmall = this.checkIsSmallScreen();
    if (isSmall) {
      this.navMode = 'over';
      this.sidenav.close();
    } else {
      this.navMode = 'side';
      this.sidenav.open();
    }
  }

  checkIsSmallScreen() {
    return this.mediaService.query(this.triggerWidth);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.portfolioChangedSub.unsubscribe();
  }

}
