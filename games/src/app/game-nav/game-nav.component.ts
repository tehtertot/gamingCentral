import { Component, OnInit } from '@angular/core';
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
  instructions: {name: string,
                 goal: string,
                 rules: string} = {name: '', goal: '', rules: ''};

  constructor(private _user: UserService, private _router: Router, private _games: GamesService) { }

  ngOnInit() {   
    this.displayOpenGames(); 
    this._user.getUserInfo()
    .then((user) => { this.currentUser = {username: user.username, id: user.id}; })
    .catch((err) => { this._router.navigate(['/login']); });
  }

  displayOpenGames() {
    this._games.getOpenGames()
    .then((games) => { this.openGames = games; })
    .catch((err) => { console.log(err); });
  }

  joinGame(game) {
    this._games.joinGame(game)
    .then(() => { 
      if (game.selection == 'Machi Koro') {
        this._router.navigate(['/machi', game.numPlayers, game._id]);
      }
      else if (game.selection == 'Incan Gold') {
        this._router.navigate(['/incan', game.numPlayers, game._id]);
      }
    })
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
    alert("7 Wonders under construction :)");
    // let g = new Game();
    // g.players.push(this.currentUser);
    // while (g.numPlayers < 3 || g.numPlayers > 7) {
    //   g.numPlayers = Number(prompt("How many players (3 - 7)?"));
    // };
    // g.selection = "7 Wonders";
    // this._games.startGame(g)
    // .then(() => { this.displayOpenGames(); })
    // .catch((err) => { console.log(err); });
  }

  startMK() {
    let g = new Game();
    g.players.push(this.currentUser);
    while (g.numPlayers < 2 || g.numPlayers > 4) {
      g.numPlayers = Number(prompt("How many players (2 - 4)?"));
    };
    g.selection = "Machi Koro";
    this._games.startGame(g)
    .then((g) => { this._router.navigate(['/machi', g.numPlayers, g._id]); })
    .catch((err) => { console.log(err); });
  }

  showInstructions(game) {
    if (game == 'incan') {
      this.instructions.name = 'Incan Gold';
      this.instructions.goal = 'Be the player to obtain the most treasure.';
      this.instructions.rules = "1. At the beginning of the game, the deck contains 15 treasure cards (amounts 1-15), and 3 each of 5 different hazard cards. At the beginning of each round, one artifact card gets shuffled into the deck. In the first 3 rounds, the artifact cards are diamonds worth 5 points each. The last 2 are gold worth 10 points each.\n\n2. During each round, before a card gets drawn, each player decides whether they want to keep exploring or get out of the mine.\n\n3. Regular treasure card amounts are divided evenly among players who chose to stay. Any remaining treasure is left on the table.\n\n4. When a player chooses to leave the mine, s/he splits all outstanding treasure evenly with all other players who left, and any accumlated treasure are added to the player's cumulative score. Diamonds and gold can only be taken if the player leaving is the only player to leave.\n\n5. A round ends when either all the players choose to stop exploring, or two of the same hazards are drawn.\n\n6. If two obstacles are drawn within the same round, all players still exploring lose any accumulated treasure from that round. One card of that hazard gets removed from the deck. Any unclaimed artifacts also get removed from the deck. All other cards get shuffled back into the deck.";
    }
    else if (game == 'machi') {
      this.instructions.name = 'Machi Koro';
      this.instructions.goal = 'Be the first to build all your city attractions.';
      this.instructions.rules = '';
    }
    else if (game == 'sw') {
      this.instructions.name = '7 Wonders';
      this.instructions.goal = 'Be the player with the most points after 3 ages.';
      this.instructions.rules = '';
    }
    let modal = document.getElementById('instructions');
    modal.style.display = "block";
  }

  closeModal() {
    let modal = document.getElementById('instructions');
    modal.style.display = "none";
  }


}
