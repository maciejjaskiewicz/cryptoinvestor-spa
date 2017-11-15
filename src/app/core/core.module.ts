import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmChartsModule } from '@amcharts/amcharts3-angular';

import { SharedModule } from './../shared/shared.module';
import { CoreRoutingModule } from './core-routing.module';

import { CoreComponent } from './core.component';
import { CoinsComponent } from './coins/coins.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { AccountComponent } from './account/account.component';
import { AboutComponent } from './about/about.component';
import { CoinDetailComponent } from './coins/coin-detail/coin-detail.component';
import { CoinListComponent } from './coins/coin-list/coin-list.component';
import { CoinChartComponent } from './coins/coin-detail/coin-chart/coin-chart.component';
import { CoinsService } from './coins/coins.service';
import { CoinChartService } from './coins/coin-detail/coin-chart/coin-chart.service';
import { FavouritesService } from './favourites/favourites.service';
import { PortfolioService } from './portfolio/portfolio.service';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioDetailsComponent } from './portfolio/portfolio-details/portfolio-details.component';
import { TransactionsTableComponent } from './portfolio/portfolio-details/transactions-table/transactions-table.component';
import {
  TransactionDialogComponent
} from './portfolio/portfolio-details/transactions-table/transaction-dialog/transaction-dialog.component';
import { NewTransactionDialogComponent } from './portfolio/portfolio-details/new-transaction-dialog/new-transaction-dialog.component';


@NgModule({
  declarations: [
    CoreComponent,
    CoinsComponent,
    FavouritesComponent,
    AccountComponent,
    AboutComponent,
    CoinDetailComponent,
    CoinListComponent,
    CoinChartComponent,
    PortfolioComponent,
    PortfolioDetailsComponent,
    TransactionsTableComponent,
    TransactionDialogComponent,
    NewTransactionDialogComponent
  ],
  entryComponents: [
    TransactionDialogComponent,
    NewTransactionDialogComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AmChartsModule,
    SharedModule,
    CoreRoutingModule
  ],
  providers: [
    CoinsService,
    CoinChartService,
    FavouritesService,
    PortfolioService
  ]
})

export class CoreModule { }
