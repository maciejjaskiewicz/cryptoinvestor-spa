import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../environments/environment';
import { Transaction } from './portfolio-details/transactions-table/Transaction.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class PortfolioService {
  private portfolioApiUrl = `${environment.apiEndpoint}portfolio`;
  private transactionsApiUrl = `${environment.apiEndpoint}transactions`;
  portfolioChanged = new Subject();
  transactionsChanged = new Subject();

  constructor(private authHttp: AuthHttp) { }

  getPortfolios() {
    return this.authHttp.get(this.portfolioApiUrl).map(
      (response: Response) => {
        const json = response.json();
        if (response.status === 200) {
          return json;
        }
      }
    ).catch(this._error);
  }

  getPortfolio(nameId: string) {
    return this.authHttp.get(`${this.portfolioApiUrl}/${nameId}`).map(
      (response: Response) => {
        const json = response.json();
        if (response.status === 200) {
          return json;
        }
      }
    ).catch(this._error);
  }

  createNewPortfolio(name: string) {
    const payload = JSON.stringify({ Name: name });
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this.portfolioApiUrl, payload, options).map(
      (response: Response) => {
        if (response.status === 201) {
          return true;
        } else {
          return false;
        }
      }
    ).catch(this._error);
  }

  updatePortfolio(nameId: string, newName: string) {
    const payload = JSON.stringify({ NameId: nameId, Name: newName });
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers });

    return this.authHttp.put(this.portfolioApiUrl, payload, options).map(
      (response: Response) => {
        if (response.status === 200) {
          this.portfolioChanged.next();
          return true;
        } else {
          return false;
        }
      }
    );
  }

  deletePortfolio(id: string) {
    return this.authHttp.delete(`${this.portfolioApiUrl}/${id}`).map(
      (response: Response) => {
        if (response.status === 200) {
          this.portfolioChanged.next();
          return true;
        } else {
          return false;
        }
      }
    ).catch(this._error);
  }

  getTransactions(portfolioNameId: string) {
    return this.authHttp.get(`${this.portfolioApiUrl}/${portfolioNameId}/transactions`).map(
      (response: Response) => {
        const json = response.json();
        if (response.status === 200) {
          return json;
        }
      }
    ).catch(this._error);
  }

  updateTransaction(id: string, transaction: Transaction) {
    const payload = JSON.stringify({
      Id: id,
      CoinSymbol: transaction.coinSymbol,
      PurchasePrice: transaction.buyPrice,
      PurchaseDate: Math.floor(transaction.date.getTime() / 1000),
      Amount: transaction.amount,
      Sold: transaction.sold,
      SoldPrice: transaction.soldPrice,
      Currency: 'USD'
    });
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers });

    return this.authHttp.put(this.transactionsApiUrl, payload, options).map(
      (response: Response) => {
        if (response.status === 200) {
          this.transactionsChanged.next();
          return true;
        }
      }
    ).catch(this._error);
  }

  deleteTransaction(id: string) {
    return this.authHttp.delete(`${this.transactionsApiUrl}/${id}`).map(
      (response: Response) => {
        if (response.status === 200) {
          this.transactionsChanged.next();
          return true;
        }
      }
    ).catch(this._error);
  }

  createNewTransaction(portfolioNameId: string, transaction: Transaction) {
    const payload = JSON.stringify({
      PortfolioNameId: portfolioNameId,
      CoinSymbol: transaction.coinSymbol,
      PurchasePrice: transaction.buyPrice,
      PurchaseDate: Math.floor(transaction.date.getTime() / 1000),
      Amount: transaction.amount,
      Currency: 'USD'
    });
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this.transactionsApiUrl, payload, options).map(
      (response: Response) => {
        if (response.status === 201) {
          this.transactionsChanged.next();
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
