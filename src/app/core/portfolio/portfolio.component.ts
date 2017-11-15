import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CoinsService } from './../coins/coins.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  constructor(
    private coinsService: CoinsService
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('coins')) {
      this.coinsService.getShortCoinsList().subscribe(
        (data) => localStorage.setItem('coins', JSON.stringify(data))
      );
    }
  }

}
