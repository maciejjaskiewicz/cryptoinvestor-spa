import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
  private apiUrl = environment.apiEndpoint;

  constructor(private authHttp: AuthHttp) { }

  getProfile() {
    return this.authHttp.get(this.apiUrl + 'account/me')
      .map((response: Response) => {
        const data = response.json();
        return data;
      }
    ).catch(this._error);
  }

  getLocaleProfile() {
    const json = JSON.parse(localStorage.getItem('fullProfile'));
    return json;
  }

  updateProfile(firstName: string, lastName: string, gender: string) {
    const payload = JSON.stringify({ FirstName: firstName, LastName: lastName, Gender: gender });
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers });

    return this.authHttp.put(this.apiUrl + 'account/me', payload, options).map(
      (response: Response) => {
        if (response.status === 200) {
          this.updateLocaleProfile(firstName, lastName, gender);
          return true;
        }
      }
    );
  }

  private updateLocaleProfile(firstName: string, lastName: string, gender: string) {
    const profile = this.getLocaleProfile();
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.gender = gender;

    localStorage.removeItem('fullProfile');
    localStorage.setItem('fullProfile', JSON.stringify(profile));
  }

  private _error(err: any) {
    return Observable.throw(err || 'error');
  }
}
