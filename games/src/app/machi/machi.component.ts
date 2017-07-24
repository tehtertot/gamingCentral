import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-machi',
  templateUrl: './machi.component.html',
  styleUrls: ['./machi.component.css']
})
export class MachiComponent implements OnInit {
  connection; 
  inPlay: boolean = false;
  gameId: string;
  gameCap: number;
  game: object;
  currentUser: string;
  decisionMade: boolean = false;
  active: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
