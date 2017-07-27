import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MachiKoroSocketsService } from './sockets.service';
import { UserService } from '../users/user.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-machi',
  templateUrl: './machi.component.html',
  styleUrls: ['./machi.component.css']
})
export class MachiComponent implements OnInit, OnDestroy {
  inPlay: boolean = false;
  displayDeck: Array<object>;
  gameId: string;
  gameCap: number;
  game: object;
  currentUser: string;
  rolled: boolean = false;
  canPurchase: boolean = false;
  results: string = '';
  subscriptions: Array<Subscription> = [];

  constructor(private _socket: MachiKoroSocketsService, private _users: UserService, private _myRoute: ActivatedRoute, private _router: Router) { 
    this._myRoute.params.subscribe((param) => { 
      this.gameId = param.game_id; 
      this.gameCap = param.game_cap; });
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
    let start_sub = this._socket.initiatePlay(gameInfo).subscribe((newGame) => { 
      this.inPlay = true;
      this.game = newGame;
    });
    let game_sub = this._socket.gameUpdated().subscribe((updatedGame) => {
      this.game = updatedGame["game"];
      this.results = updatedGame["results"];
      if (this.currentUser == this.game["players"][this.game["turn"]].id && this.rolled) {
        this.canPurchase = true;
        this.rolled = false;
      }
    });
    this.subscriptions = [start_sub, game_sub];
  }

  rollOne() {
    this.rolled = true;
    let roll = Math.floor(Math.random()*6)+1;
    let play = {id: this.currentUser, rollVal: roll, gameId: this.gameId};
    this._socket.gameRoll(play);
  }

  rollTwo() {
    this.rolled = true;
    let roll1 = Math.floor(Math.random()*6)+1;
    let roll2 = Math.floor(Math.random()*6)+1;
    let play = {id: this.currentUser, rollVal: roll1+roll2, gameId: this.gameId};
    this._socket.gameRoll(play);
  }

  purchaseCard(card) {
    console.log(card);
    var warn = false;
    if (this.canPurchase) {
      //validate purchase
      if (this.game["players"][this.game["turn"]].coins < card.cost) {
        warn = true;
        alert("You don't have enough money to purchase that card.");
      }
      //can only have one of each purple card
      else if (card.type == 'purple') {
        if (card.name == 'Stadium' && this.game["players"]["majorEstablishments"]["stadium"]) {
          warn = true;
          alert("You already have a Stadium.");
        }
        else if (card.name == 'TV Station' && this.game["players"]["majorEstablishments"]["tv"]) {
          warn = true;
          alert("You already have a TV Station.");
        }
        else if (card.name == 'Business Center' && this.game["players"]["majorEstablishments"]["business"]) {
          warn = true;
          alert("You already have a Business Center.");
        }
      }

      if (!warn) {
        this.canPurchase = false;
        let p = {card: card, playerId: this.currentUser, gameId: this.gameId};
        this._socket.gamePurchase(p);
      }
    }
  }

  buildLandmark(landmarkNum) {
    let cost = [4,10,16,22];
    if (this.game["players"][this.game["turn"]].coins < cost[landmarkNum]) {
      alert("You don't have enough money to develop that landmark.");
    }
    else {
      this.canPurchase = false;
      let p = {landmark: landmarkNum, playerId: this.currentUser, gameId: this.gameId};
      this._socket.buildLandmark(p); 
    }
  }

  pass() {
    if (this.canPurchase) {
      this.canPurchase = false;
      let p = {playerId: this.currentUser, gameId: this.gameId};
      this._socket.passTurn(p);
    }
  }

  showCardDetails(c) {
    // console.log(c);
  }

  showLandmark(landmarkNum) {
    switch(landmarkNum) {
      case 0:
        let d = document.getElementById('traincard');
        break;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this._socket.disconnect();
  }

}
