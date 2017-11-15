import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class FavouritesService {
  private favouritesApiUrl = `${environment.apiEndpoint}favourites`;

  constructor(private authHttp: AuthHttp) { }

  getFavourites() {
    return this.authHttp.get(this.favouritesApiUrl).map(
      (response: Response) => {
        const json = response.json();
        if (response.status === 200) {
          return json;
        }
      }
    ).catch(this._error);
  }

  addToFavourites(coinSymbol: string) {
    const payload = JSON.stringify({ CoinSymbol: coinSymbol });
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers });

    return this.authHttp.put(this.favouritesApiUrl, payload, options).map(
      (response: Response) => {
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      }
    ).catch(this._error);
  }

  removeFromFavourites(coinSymbol: string) {
    return this.authHttp.delete(`${this.favouritesApiUrl}/${coinSymbol}`).map(
      (response: Response) => {
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      }
    ).catch(this._error);
  }

  private _error(err: any) {
    return Observable.throw(err || 'error');
  }
}
