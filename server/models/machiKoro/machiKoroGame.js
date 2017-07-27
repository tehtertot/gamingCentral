const MachiKoroDeck = require('./machiKoroDeck.js');

class MachiKoroGame {
    constructor(id, totalPlayers) {
        this.id = id;
        this.players = [];
        this.deck = new MachiKoroDeck();
        this.turn = 0;
        this.totalPlayers = totalPlayers;   //initial input from first user for number of players
        this.gameOver = false;
        this.winner;
    }

    rollResults(rollVal) {
        let rollKey = "roll" + rollVal;
        let strResult = `${this.players[this.turn].username} rolled a ${rollVal}.\n`;
        //pay out to other players' red cards
        let m = this.players.length;
        let t = (this.turn + 1) % m;
        while (t != this.turn) {
            let payout = this.players[t].rolls[rollKey][2];
            if (this.players[this.turn].coins > 0 &&  payout > 0) {
                this.players[this.turn].coins -= payout;
                this.players[t].coins += payout;
                strResult += `${this.players[this.turn].username} payed ${this.players[t].username} ${payout} coins.\n`;
            }
            t = (t+1) % m;
        }
        //collect on rolling player's green cards
        let greenVal = this.players[this.turn].rolls[rollKey][1];
        this.players[this.turn].coins += greenVal;
        if (greenVal > 0) {
            strResult += `${this.players[this.turn].username} collected ${greenVal} coins.\n`;
        }
        //all players collect on blue cards
        for (let p of this.players) {
            p.coins += p.rolls[rollKey][0];
            if (p.rolls[rollKey][0] > 0) {
                strResult += `${p.username} collected ${p.rolls[rollKey][0]} coins.\n`;
            }
        }
        //collect on purple cards from other players

        return strResult;
    }

    purchaseCard(card) {
        this.players[this.turn].coins -= card.cost;
        for (let i = 0; i < card.roll.length; i++) {
            let idx = "roll" + card.roll[i];
            if (card.type == 'blue') {
                this.players[this.turn].rolls[idx][0] += card.reward;
            } 
            else if (card.type == 'green') {
                this.players[this.turn].rolls[idx][1] += card.reward;
            }
            else if (card.type == 'red') {
                this.players[this.turn].rolls[idx][2] += card.reward;
            }
            else if (card.type == 'purple') {
                if (card.name == 'Stadium') {
                    this.players[this.turn].majorEstablishments.stadium = true;
                }
                else if (card.name == 'TV Station') {
                    this.players[this.turn].majorEstablishments.tv = true;
                }
                else if (card.name == 'Business Center') {
                    this.players[this.turn].majorEstablishments.business = true;
                }
            }
        }
        this.players[this.turn].cards.push(card);
        for (let p in this.deck.inPlay) {
            if (this.deck.inPlay[p].name == card.name) {
                this.deck.inPlay.splice(p, 1);
                break;
            }
        }
        this.deck.drawCard();
    }

    switchTurns() {
        this.turn = (this.turn+1) % this.players.length;
        return this.players[this.turn].socketId;
    }
}

module.exports = MachiKoroGame;