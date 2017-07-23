import { Component, OnInit } from '@angular/core';
import { Player } from './models/player';

@Component({
  selector: 'app-seven-wonders',
  templateUrl: './seven-wonders.component.html',
  styleUrls: ['./seven-wonders.component.css']
})
export class SevenWondersComponent implements OnInit {
  allPlayers: Array<Player>;
  constructor() { }

  ngOnInit() {
  }

}
