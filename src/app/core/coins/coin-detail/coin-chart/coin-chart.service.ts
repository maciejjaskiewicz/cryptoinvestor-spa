import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class CoinChartService {
  private apiUrl = 'https://min-api.cryptocompare.com/data/';

  constructor(private http: Http) { }

  getData(coinSymbol: string, period: string) {
    let params: string;

    switch (period) {
      case '1h':
        params = `histominute?fsym=${coinSymbol}&tsym=USD&limit=60&aggregate=1&e=CCCAGG`;
        break;
      case '1d':
        params = `histominute?fsym=${coinSymbol}&tsym=USD&limit=144&aggregate=10&e=CCCAGG`;
        break;
      case '1w':
        params = `histohour?fsym=${coinSymbol}&tsym=USD&limit=168&aggregate=1&e=CCCAGG`;
        break;
      case '1m':
        params = `histohour?fsym=${coinSymbol}&tsym=USD&limit=120&aggregate=6&e=CCCAGG`;
        break;
      case '3m':
        params = `histoday?fsym=${coinSymbol}&tsym=USD&limit=90&aggregate=1&e=CCCAGG`;
        break;
      case '6m':
        params = `histoday?fsym=${coinSymbol}&tsym=USD&limit=180&aggregate=1&e=CCCAGG`;
        break;
      case '1y':
        params = `histoday?fsym=${coinSymbol}&tsym=USD&limit=365&aggregate=1&e=CCCAGG`;
        break;
      case '3y':
        params = `histoday?fsym=${coinSymbol}&tsym=USD&limit=207&aggregate=7&e=CCCAGG`;
        break;
      case 'max':
        params = `histoday?fsym=${coinSymbol}&tsym=USD&allData=true&aggregate=7&e=CCCAGG`;
        break;
      default:
        params = `histominute?fsym=${coinSymbol}&tsym=USD&limit=60aggregate=1&e=CCCAGG`;
        break;
    }

    return this.getDataFromApi(params);
  }

  private getDataFromApi(params: string) {
    return this.http.get(this.apiUrl + params).map(
      (response: Response) => {
        const json = response.json();
        if (json.Response === 'Success') {
          return json.Data;
        }
      }
    ).catch(this._error);
  }

  private _error(err: any) {
    return Observable.throw(err || 'error');
  }
}
