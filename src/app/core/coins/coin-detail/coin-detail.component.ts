import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CoinsService } from './../coins.service';
import { FavouritesService } from './../../favourites/favourites.service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit, OnDestroy {
  coinSymbol: string;
  coinName: string;
  coinDetails: any;

  constructor(
    private route: ActivatedRoute,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef,
    private coinsService: CoinsService,
    private favouritesService: FavouritesService,
    private upperCasePipe: UpperCasePipe
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.coinSymbol = params['id'];
      }
    );

    this.coinName = localStorage.getItem(this.coinSymbol);
    const cSymbol = this.upperCasePipe.transform(this.coinSymbol);
    this.coinsService.getCoinDetails(cSymbol).subscribe(
      (data) => {
        this.coinDetails = data;
      }
    );
  }

  addToFavourites() {
    this.favouritesService.addToFavourites(this.coinSymbol).subscribe(
      (result) => {
        if (result) {
          this.openAlertDialog('Success', 'This coin has been added to your favourites collection.');
        }
      },
      (err) => {
        const errorBody = JSON.parse(err._body);
        if (errorBody.code === 'coin_already_exists') {
          this.openAlertDialog('Already exists', 'This coin already exists in your favourites collection.');
        }
      }
    );
  }

  ngOnDestroy() {
    localStorage.removeItem(this.coinSymbol);
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
}
