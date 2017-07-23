import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import 'slick-carousel';
import { Game } from './game';
import { UserService } from '../users/user.service';
import { GamesService } from './games.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-nav',
  templateUrl: './game-nav.component.html',
  styleUrls: ['./game-nav.component.css']
})
export class GameNavComponent implements OnInit {
  openGames: Array<Game> = [];
  currentUser: Object = {};

  constructor(private _user: UserService, private _router: Router, private _games: GamesService) { }

  ngOnInit() {   
    this.displayOpenGames(); 
    this._user.getUserInfo()
    .then((user) => { this.currentUser = {username: user.username, id: user.id}; })
    .catch((err) => { this._router.navigate(['/login']); });

    jQuery('.game-slider').slick({
      centerMode: true,
      centerPadding: '60px',
      slidesToShow: 3,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });
  }

  displayOpenGames() {
    this._games.getOpenGames()
    .then((games) => { this.openGames = games; })
    .catch((err) => { console.log(err); });
  }

  joinGame(game) {
    this._games.joinGame(game)
    .then(() => { this._router.navigate(['/incan', game.numPlayers, game._id]); })
    .catch((err) => { console.log(err); });
  }

  startIG() {
    let g = new Game();
    g.players.push(this.currentUser);
    while (g.numPlayers < 3 || g.numPlayers > 8) {
      g.numPlayers = Number(prompt("How many players (3 - 8)?"));
    };
    g.selection = "Incan Gold";
    this._games.startGame(g)
    .then((g) => { this._router.navigate(['/incan', g.numPlayers, g._id]); })
    .catch((err) => { console.log(err); });
  }

  startSW() {
    let g = new Game();
    g.players.push(this.currentUser);
    while (g.numPlayers < 2 || g.numPlayers > 7) {
      g.numPlayers = Number(prompt("How many players (2 - 7)?"));
    };
    g.selection = "7 Wonders";
    console.log(g);
    this._games.startGame(g)
    .then(() => { this.displayOpenGames(); })
    .catch((err) => { console.log(err); });
  }

}
