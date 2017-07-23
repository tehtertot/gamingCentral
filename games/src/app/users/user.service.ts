import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs';

@Injectable()
export class UserService {

  constructor(private _http: Http) { }

  register(user) {
    return this._http.post('/register', user).map(data => data.json()).toPromise();
  }
  
  login(user) {
    return this._http.post('/login', user).map(data => data.json()).toPromise();
  }

  getUserInfo() {
    return this._http.get('/userInfo').map(data => data.json()).toPromise();
  }
}
