import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/catch';

@Injectable()
export class CoinsService {
  private coinsListApiUrl = `${environment.apiEndpoint}coins`;
  private favouritesApiUrl = `${environment.apiEndpoint}favourites`;
  private coinsDetailApiUrl = 'https://min-api.cryptocompare.com/data/pricemultifull';

  constructor(
    private http: Http
  ) { }

  getCoinDetails(coinSymbol: string) {
    const params = `?fsyms=${coinSymbol}&tsyms=USD`;

    return this.http.get(this.coinsDetailApiUrl + params).map(
      (response: Response) => {
        const json = response.json();
        if (response.status === 200) {
          return json.DISPLAY[coinSymbol].USD;
        }
      }
    ).catch(this._error);
  }

  getCoinsList() {
    return this.http.get(this.coinsListApiUrl).map(
      (response: Response) => {
        const json = response.json();
        if (response.status === 200) {
          return json;
        }
      }
    ).catch(this._error);
  }

  getShortCoinsList() {
    return this.http.get(`${this.coinsListApiUrl}?short=true`).map(
      (response: Response) => {
        const json = response.json();
        if (response.status === 200) {
          return json;
        }
      }
    ).catch(this._error);
  }

  private _error(err: any) {
    return Observable.throw(err || 'error');
  }
}
