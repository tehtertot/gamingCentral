import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MachiKoroSocketsService } from './sockets.service';
import { UserService } from '../users/user.service';
import { Subscription } from 'rxjs/Subscription';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-machi',
  templateUrl: './machi.component.html',
  styleUrls: ['./machi.component.css'],
  animations: [
    trigger('rollDieOne', [
      state('nospin1', style({
        display: 'inline-block',
        transform: 'rotate(0deg)'
      })),
      state('spin1', style({
        transform: 'rotate(180deg)',
      })),
      transition('spin1 <=> nospin1', animate('100ms ease-in')),
    ]),
    trigger('rollDieTwo', [
      state('nospin2', style({
        display: 'inline-block',
        transform: 'rotate(0deg)'
      })),
      state('spin2', style({
        transform: 'rotate(180deg)',
      })),
      transition('spin2 <=> nospin2', animate('100ms ease-in')),
    ]),
  ]
})
export class MachiComponent implements OnInit, OnDestroy {
  state1: string = 'nospin1';
  state2: string = 'nospin2';
  inPlay: boolean = false;
  displayDeck: Array<object>;
  gameId: string;
  gameCap: number;
  game: object;
  currentUser: string;
  rolled: boolean = false;
  rollCount = 0;
  canPurchase: boolean = false;
  subscriptions: Array<Subscription> = [];
  tvUser;

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
      this.game = updatedGame;
      document.getElementById('die1').setAttribute('src', `/machi/green${this.game["roll1"]}.png`);
      this.state1 = (this.state1 === 'nospin1' ? 'spin1' : 'nospin1');
      if (this.game["roll2"] > 0) {
        let d2 = document.getElementById('die2');
        d2.style.display = "inline-block";
        d2.setAttribute('src', `/machi/blue${this.game["roll2"]}.png`);
        this.state2 = (this.state2 === 'nospin2'? 'spin2' : 'nospin2');
      }
      else {
        document.getElementById('die2').style.display = "none";
      }
      if (this.currentUser == this.game["players"][this.game["turn"]].id && this.rolled) {
        this.canPurchase = true;
        this.rolled = false;
        this.rollCount = 0;
      }
    });
    this.subscriptions = [start_sub, game_sub];
  }

  rollOne() {
    var reroll = false;
    this.rollCount++;
    if (this.game["players"][this.game["turn"]].progress[3] && this.rollCount == 1) {
      reroll = confirm("Do you want to re-roll?");
    }
    if (!reroll) {
      this.rolled = true;
      let roll = Math.floor(Math.random()*6)+1;
      // if (roll == 6) {
      //   let majorEst = this.game["players"][this.game["turn"]].majorEstablishments;
      //   if (majorEst["tv"]) {
      //     //get user to steal from
      //   }
      //   if (majorEst("business")) {
      //     //choose which user
      //     //display their and your cards
      //     //get selection
      //   }
      // }
      let play = {id: this.currentUser, rollVal1: roll, rollVal2: 0, gameId: this.gameId};
      this._socket.gameRoll(play);
    }
  }

  rollTwo() {
    var reroll = false;
    this.rollCount++;
    if (this.game["players"][this.game["turn"]].progress[3] && this.rollCount == 1) {
      reroll = confirm("Do you want to re-roll?");
    }
    if (!reroll) {
      this.rolled = true;
      let roll1 = Math.floor(Math.random()*6)+1;
      let roll2 = Math.floor(Math.random()*6)+1;
      let play = {id: this.currentUser, rollVal1: roll1, rollVal2: roll2, gameId: this.gameId};
      this._socket.gameRoll(play);
    }
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
        if (card.name == 'Stadium' && this.game["players"][this.game["turn"]]["majorEstablishments"]["stadium"]) {
          warn = true;
          alert("You already have a Stadium.");
        }
        else if (card.name == 'TV Station' && this.game["players"][this.game["turn"]]["majorEstablishments"]["tv"]) {
          warn = true;
          alert("You already have a TV Station.");
        }
        else if (card.name == 'Business Center' && this.game["players"][this.game["turn"]]["majorEstablishments"]["business"]) {
          warn = true;
          alert("You already have a Business Center.");
        }
      }
      console.log("warn status", warn);
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

  showLandmark(landmarkNum, idx) {
    var d;
    switch(landmarkNum) {
      case 0:
        d = document.getElementsByClassName('traincard');
        break;
      case 1:
        d = document.getElementsByClassName('mallcard');
        break;
      case 2:
        d = document.getElementsByClassName('parkcard');
        break;
      case 3:
        d = document.getElementsByClassName('towercard');
        break;
    }
    d[idx].style.display = 'block';
  }

  hideLandmark(landmarkNum, idx) {
    var d;
    switch(landmarkNum) {
      case 0:
        d = document.getElementsByClassName('traincard');
        break;
      case 1:
        d = document.getElementsByClassName('mallcard');
        break;
      case 2:
        d = document.getElementsByClassName('parkcard');
        break;
      case 3:
        d = document.getElementsByClassName('towercard');
        break;
    }
    d[idx].style.display = 'none';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this._socket.disconnect();
  }

}
