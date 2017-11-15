import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavouritesService } from './favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  favouritesData: any;

  constructor(
    private router: Router,
    private favouritesService: FavouritesService
  ) { }

  ngOnInit() {
    this.getFavourites();
  }

  goDetails(symbol: string) {
    this.router.navigate([`/app/coins/${symbol}`]);
  }

  removeFromFavourites(symbol: string) {
    this.favouritesService.removeFromFavourites(symbol).subscribe(
      (data) => {
        this.getFavourites();
       }
    );
  }

  private getFavourites() {
    this.favouritesService.getFavourites().subscribe(
      (data) => {
        this.favouritesData = data;
      }
    );
  }

}
