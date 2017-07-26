import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MachiKoroSocketsService } from './sockets.service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-machi',
  templateUrl: './machi.component.html',
  styleUrls: ['./machi.component.css']
})
export class MachiComponent implements OnInit, OnDestroy {
  connection; 
  inPlay: boolean = false;
  displayDeck: Array<object>;
  gameId: string;
  gameCap: number;
  game: object;
  currentUser: string;
  decisionMade: boolean = false;
  canPurchase: boolean = false;
  results: string = '';

  constructor(private _socket: MachiKoroSocketsService, private _users: UserService, private _myRoute: ActivatedRoute, private _router: Router) { 
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
      this.displayDeck = [];
      for (let c of this.game["deck"].inPlay) {
        if(!this.displayDeck.includes(c)) {
          this.displayDeck.push(c);
        } 
      }
      this.displayDeck.sort((a, b) => { return a["roll"][0] - b["roll"][0]; });
    });
  }

  rollOne() {
    this.decisionMade = true;
    let roll = Math.floor(Math.random()*6)+1;
    let play = {id: this.currentUser, rollVal: roll, gameId: this.gameId};
    // this.connection = this._socket.gameRoll(play).subscribe((updatedGame) => {  
    //   this.game = updatedGame["game"];
    //   this.results += updatedGame["results"];
    //   this.canPurchase = true;
    // });
  }

  rollTwo() {
    this.decisionMade = true;
    let roll1 = Math.floor(Math.random()*6)+1;
    let roll2 = Math.floor(Math.random()*6)+1;
    console.log(roll1 + " " + roll2);
  }

  purchaseCard(card) {
    if (this.canPurchase) {
      if (this.game["players"][this.game["turn"]].coins < card.cost) {
        alert("You don't have enough money to purchase that card.");
      }
      else {
        this.canPurchase = false;
        let p = {card: card, playerId: this.currentUser, gameId: this.gameId};
        // this.connection = this._socket.gamePurchase(p).subscribe((updatedGame) => {
        //   this.game = updatedGame;
        //   console.log(this.game);
        //   if (this.currentUser == this.game["players"][this.game["turn"]].id) {
        //     this.decisionMade = false;
        //   }
        // });
      }
    }
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
