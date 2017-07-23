import { Player } from './player';

export class Game {
    constructor(
        public selection: string = '',
        public numPlayers: number = 0,
        public players: Array<object> = [],
        public status: number = 0 //0 - waiting for more players, 1 - started, 2 - in play, 3 - finished
    ){}
}
