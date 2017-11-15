import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AuthHttp, tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { UserService } from './../shared/user.service';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {
  private loggedIn: boolean;
  private apiUrl = environment.apiEndpoint;
  private jwtHelper: JwtHelper = new JwtHelper();
  authStatusChanged = new Subject<boolean>();

  constructor(
    private http: Http,
    private authHttp: AuthHttp,
    private router: Router,
    private userService: UserService
  ) { }

  login(email: string, password: string): Observable<boolean> {
    const payload = JSON.stringify({ Email: email, Password: password });
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.apiUrl + 'account/login', payload, options).map(
      (response: Response) => {
        const token = response.json() && response.json().token;
        if (token) {
          this._setSession(token).then(
            () => this.router.navigate(['/app'])
          );
        }
      }
    ).catch(this._error);
  }

  register(email: string, username: string, password: string) {
    const payload = JSON.stringify({ Email: email, Username: username, Password: password });
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.apiUrl + 'account/register', payload, options)
      .map((response: Response) => {
        if (response.status === 201) {
          return true;
        } else {
          return false;
        }
      }
    ).catch(this._error);
  }

  emailInUse(email: string) {
    return this.http.get(this.apiUrl + 'users/' + email)
      .map((response: Response) => {
        if (response.status === 200) {
          return true;
        }
      }
    ).catch(this._error);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullProfile');
    this._setLoggedIn(false);

    this.router.navigate(['/signin']);
  }

  private _error(err: any) {
    return Observable.throw(err || 'error');
  }

  private _setSession(token: string) {
    const promise = new Promise((resolve, reject) => {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', this._fetchUserId(token));
      this.userService.getProfile().subscribe(
        data => {
          localStorage.setItem('fullProfile', JSON.stringify(data));
          this._setLoggedIn(true);
          resolve();
        }
      );
    });
    return promise;
  }

  private _setLoggedIn(value: boolean) {
    this.authStatusChanged.next(value);
    this.loggedIn = value;
  }

  private _fetchUserId(token: string) {
    const decodeToken = this.jwtHelper.decodeToken(token);
    return decodeToken.sub;
  }

  get authenticated() {
    return tokenNotExpired('token');
  }
}
