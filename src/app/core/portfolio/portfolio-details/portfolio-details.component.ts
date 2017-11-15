import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MatDialog } from '@angular/material';
import { PortfolioService } from './../portfolio.service';
import { NewTransactionDialogComponent } from './new-transaction-dialog/new-transaction-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { Transaction } from './transactions-table/Transaction.model';

@Component({
  selector: 'app-portfolio-details',
  templateUrl: './portfolio-details.component.html',
  styleUrls: ['./portfolio-details.component.scss']
})
export class PortfolioDetailsComponent implements OnInit, OnDestroy {
  transactionsChangedSub: Subscription;
  portfolioNameId: string;
  portfolioData: any;
  transactionsData: any[] = [];
  currentTransactions: any[] = [];
  soldTransactions: any[] = [];

  profitLoss = 0;
  holdings = 0;
  realized = 0;
  total = 0;

  constructor(
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.portfolioNameId = params['id'];
        this.fetchPortfolioData();
        this.getTransactions();
      }
    );

    this.portfolioService.transactionsChanged.subscribe(
      () => this.getTransactions()
    );
  }

  updatePortfolio() {
    this.dialogService.openPrompt({
      message: 'In this window you can change portfolio name. Please use unique name.',
      disableClose: false,
      viewContainerRef: this.viewContainerRef,
      title: 'Change portfolio name',
      value: 'New name',
      cancelButton: 'Cancel',
      acceptButton: 'Update',
    }).afterClosed().subscribe((name: string) => {
      if (name) {
        this.portfolioService.updatePortfolio(this.portfolioNameId, name).subscribe(
          (response) => this.router.navigate(['/app/coins'])
        );
      }
    });
  }

  deletePortfolio() {
    this.dialogService.openConfirm({
      message: 'Are you sure?',
      disableClose: false,
      viewContainerRef: this.viewContainerRef,
      title: `Delete portfolio: ${this.portfolioData.name}`,
      cancelButton: 'No',
      acceptButton: 'Yes',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.portfolioService.deletePortfolio(this.portfolioNameId).subscribe(
          (response) => this.router.navigate(['/app/coins'])
        );
      }
    });
  }

  onAddTransaction() {
    const dialogRef = this.dialog.open(NewTransactionDialogComponent, {
      panelClass: ['clear-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addTransaction(result);
      }
    });
  }

  addTransaction(transaction: Transaction) {
    this.portfolioService.createNewTransaction(this.portfolioNameId, transaction).subscribe(
      (response) => { }
    );
  }

  getTransactions() {
    this.portfolioService.getTransactions(this.portfolioNameId).subscribe(
      (data) => {
        this.transactionsData = this.formatData(data);
        this.separateTransactions();
        this.calculatePortfolioSummary();
      }
    );
  }

  formatData(data: any[]) {
    for (let i = 0; i < data.length; i++) {
      data[i].price = data[i].coin.prices[0].price;
      data[i].purchaseDate = new Date(data[i].purchaseDate * 1000);
    }

    return data;
  }

  calculatePortfolioSummary() {
    this.profitLoss = 0; this.holdings = 0;
    this.realized = 0; this.total = 0;

    for (let i = 0; i < this.currentTransactions.length; i++) {
      const transaction = this.currentTransactions[i];
      this.profitLoss += transaction.profit;
      this.holdings += (transaction.price * transaction.amount);
    }

    for (let i = 0; i < this.soldTransactions.length; i++) {
      const transaction = this.soldTransactions[i];
      this.realized += transaction.profit;
    }

    this.total += this.profitLoss;
    this.total += this.realized;
  }

  separateTransactions() {
    this.currentTransactions = [];
    this.soldTransactions = [];

    for (let i = 0; i < this.transactionsData.length; i++) {
      if (this.transactionsData[i].isSold === true) {
        this.transactionsData[i].profit = this.calculateSoldProfit(this.transactionsData[i]);
        this.soldTransactions.push(this.transactionsData[i]);
      } else {
        this.currentTransactions.push(this.transactionsData[i]);
      }
    }
  }

  calculateSoldProfit(data: any) {
    const profit = (data.amount * data.soldPrice) - (data.amount * data.purchasePrice);
    return profit;
  }

  fetchPortfolioData() {
    this.loadingService.register();

    this.portfolioService.getPortfolio(this.portfolioNameId).subscribe(
      (data) => {
        this.portfolioData = data;
        this.loadingService.resolve();
      }
    );
  }

  ngOnDestroy() {
    if (this.transactionsChangedSub) {
      this.transactionsChangedSub.unsubscribe();
    }
  }
}
