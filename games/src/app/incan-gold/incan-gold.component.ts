import { Component, OnInit, OnDestroy } from '@angular/core';
import { IncanSocketsService} from './sockets.service';
import { UserService } from '../users/user.service';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-incan-gold',
  templateUrl: './incan-gold.component.html',
  styleUrls: ['./incan-gold.component.css']
})
export class IncanGoldComponent implements OnInit, OnDestroy {
  connection; 
  inPlay: boolean = false;
  gameId: string;
  gameCap: number;
  game: object;
  currentUser: string;
  decisionMade: boolean = false;
  active: boolean = true;

  constructor(private _socket: IncanSocketsService, private _users: UserService, private _myRoute: ActivatedRoute, private _router: Router) { 
    this._myRoute.params.subscribe((param) => { 
      this.gameId = param.game_id; 
      this.gameCap = param.game_cap });
  }

  ngOnInit() {
    //get current player info
    let p = {};
    this._users.getUserInfo()
    .then((info) => {
      p["playerId"] = info.id;
      p["username"] = info.username;
      //set userinfo for display
      this.currentUser = info.id;
    })
    .catch((err) => { this._router.navigate(['/games']) });
    //send game and player info upon initial socket connection
    let gameInfo = {id: this.gameId, cap: this.gameCap, player: p};
    this.connection = this._socket.initiatePlay(gameInfo).subscribe((socket) => { 
      this.inPlay = true;
      this.game = socket;
    });
  }

  stay() {
    this.decisionMade = true;
    let c = {id: this.currentUser, choice: 1, gameId: this.gameId};
    this.connection = this._socket.gamePlay(c).subscribe((updatedGame) => {
      this.game = updatedGame;
      this.decisionMade = false;
    });
  }

  leave() {
    this.decisionMade = true;
    this.active = false;
    let c = {id: this.currentUser, choice: 0, gameId: this.gameId};
    this.connection = this._socket.gamePlay(c).subscribe((updatedGame) => {
      this.game = updatedGame;
      this.decisionMade = false;
    });
  }

  nextRound() {
    this.decisionMade = true;
    let c = {id: this.currentUser, choice: -1, gameId: this.gameId};
    this.connection = this._socket.gamePlay(c).subscribe((updatedGame) => {
      this.game = updatedGame;
      this.decisionMade = false;
    });
  }


  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
