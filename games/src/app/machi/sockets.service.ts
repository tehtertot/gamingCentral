import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class MachiKoroSocketsService {
  private url = 'http://localhost:8000';
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
      });
      this.socket.on('newTurn', (game) => {
        console.log("HERKEEJLRKEJRK");
        observer.next(game);
      });
      this.socket.on('updateCoins', (game) => {
        observer.next(game);
      });

      return () => {
        console.log("disconnecting..");
        this.socket.disconnect();
      };
    })
    return observable;
  }

  gameRoll(roll) {
    // let observable = new Observable(observer => {
      this.socket.emit('rolled', roll);
      // this.socket.on('updateCoins', (game) => {
      //   observer.next(game);
      // });

      // return () => {
      //   console.log("disconnecting..");
      //   this.socket.disconnect();
      // };
    // })
    // return observable;
  }

  gamePurchase(info) {
    // let observable = new Observable(observer => {
      this.socket.emit('purchased', info);
    //   this.socket.on('turnOver', (game) => {
    //     observer.next(game);
    //   });

    //   // return () => {
    //   //   console.log("disconnecting...");
    //   //   this.socket.disconnect();
    //   // }
    // })
    // return observable;
  }

}
