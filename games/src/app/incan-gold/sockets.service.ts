import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class IncanSocketsService {
  private url = 'http://localhost:8000';
  private socket;

  constructor() { }

  initiatePlay(gameInfo) {
    let observable = new Observable(observer => {
      this.socket = io.connect('/incan');
      this.socket.on('connect', () => {
        this.socket.emit('room', gameInfo);
      });
      this.socket.on('startGame', (game) => {
        observer.next(game);
      });

      return () => {
        console.log("disconnecting..");
        this.socket.disconnect();
      };
    })
    return observable;
  }

  gamePlay(choice) {
    let observable = new Observable(observer => {
      this.socket.emit('madeChoice', choice);
      this.socket.on('showCard', (game) => {
        observer.next(game);
      });
      this.socket.on('gameEnd', () => {
        alert("Game over.");
      })

      return () => {
        console.log("disconnecting..");
        this.socket.disconnect();
      };
    })
    return observable;
  }

}
