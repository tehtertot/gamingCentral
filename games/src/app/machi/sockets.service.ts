import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class MachiKoroSocketsService {
  private socket;

  constructor() { }

  initiatePlay(gameInfo) {
    let observable = new Observable(observer => {
      this.socket = io.connect('/machi');
      this.socket.on('connect', () => {
        this.socket.emit('mroom', gameInfo);
      });
      this.socket.on('startMKGame', (game) => {
        observer.next(game);
      })

      return () => {
        console.log("disconnecting..");
        this.socket.disconnect();
      };
    })
    return observable;
  }

  gameRoll(roll) {
      this.socket.emit('rolled', roll);
  }

  gamePurchase(info) {
      this.socket.emit('purchased', info);
  }

  buildLandmark(info) {
    this.socket.emit('landmark', info);
  }

  passTurn(info) {
    this.socket.emit('passed', info);
  }

  gameUpdated() {
    let observable = new Observable(observer => {
      this.socket.on('gameUpdated', (game) => {
        observer.next(game);
      })
    })
    return observable;
  }

  startTurn() {
    let observable = new Observable(observer => {
      this.socket.on('switchTurns', (game) => {
        observer.next(game);
      })
    })
    return observable;
  }

  disconnect() {
    this.socket.disconnect();
  }

}
