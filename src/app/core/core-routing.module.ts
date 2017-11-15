import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoinsComponent } from './coins/coins.component';
import { CoinListComponent } from './coins/coin-list/coin-list.component';
import { CoinDetailComponent } from './coins/coin-detail/coin-detail.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { AccountComponent } from './account/account.component';
import { AboutComponent } from './about/about.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioDetailsComponent } from './portfolio/portfolio-details/portfolio-details.component';

import { CoreComponent } from './core.component';

const coreRoutes: Routes = [
  { path: '', component: CoreComponent, children: [
    { path: '', redirectTo: '/app/coins', pathMatch: 'full' },
    { path: 'coins', component: CoinsComponent, children: [
      { path: '', component: CoinListComponent },
      { path: ':id', component: CoinDetailComponent },
    ]},
    { path: 'favourites', component: FavouritesComponent },
    { path: 'portfolio', component: PortfolioComponent, children: [
      { path: '', redirectTo: 'default', pathMatch: 'full' },
      { path: ':id', component: PortfolioDetailsComponent }
    ]},
    { path: 'account', component: AccountComponent },
    { path: 'about', component: AboutComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(coreRoutes)],
  exports: [RouterModule]
})

export class CoreRoutingModule {}
