import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs';

@Injectable()
export class GamesService {

  constructor(private _http: Http) { }

  startGame(game) {
    return this._http.post('/startGame', game).map(data => data.json()).toPromise();
  }

  joinGame(game) {
    return this._http.post('/joinGame', game).map(data => data.json()).toPromise();
  }

  getOpenGames() {
    return this._http.get('/allOpen').map(data => data.json()).toPromise();
  }

}
