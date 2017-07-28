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
        this.roll1 = 0;
        this.roll2 = 0;
    }

    rollResults(rollVal1, rollVal2) {
        this.roll1 = rollVal1;
        this.roll2 = rollVal2;
        let rollVal = rollVal1 + rollVal2;
        let rollKey = "roll" + rollVal;
        let strResult = '';
        // let strResult = `${this.players[this.turn].username} rolled a ${rollVal}.\n`;
        //pay out to other players' red cards
        var m = this.players.length;
        var t = (this.turn + 1) % m;
        while (t != this.turn) {
            let payout = this.players[t].rolls[rollKey][2];
            if (this.players[this.turn].coins > 0 &&  payout > 0) {
                this.players[this.turn].coins -= payout;
                this.players[t].coins += payout;
                strResult += `${this.players[this.turn].username} payed ${this.players[t].username} ${payout} coins.\n`;
            }
            t = (t+1) % m;
        }
        //collect on rolling player's regular green cards
        let greenVal = this.players[this.turn].rolls[rollKey][1];
        //collect on rolling player's multiplicative green cards
        let mult = this.players[this.turn].rolls[rollKey][3];
        if (mult) {
            greenVal += mult * this.players[this.turn].catCount[this.players[this.turn].rolls[rollKey][4]];
        }
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
        //STADIUM
        if (this.players[this.turn].majorEstablishments["stadium"] && rollVal == 6) {
            t = (this.turn + 1) % m;
            while (t != this.turn) {
                let payout = (this.players[t].coins < 2) ? this.players[t].coins : 2;
                this.players[t].coins -= payout;
                this.players[this.turn].coins += payout;
                strResult += `${this.players[t].username} payed ${this.players[this.turn].username} ${payout} coins.\n`;
                t = (t+1) % m;
            }
        }
        //TV STATION
        if (this.players[this.turn].majorEstablishments["tv"]) {
            
        }
        return strResult;
    }

    purchaseCard(card) {
        console.log("purchasing...", card);
        this.players[this.turn].coins -= card.cost;
        this.players[this.turn].catCount[card.category]++;
        for (let i = 0; i < card.roll.length; i++) {
            let idx = "roll" + card.roll[i];
            if (card.type == 'blue') {
                this.players[this.turn].rolls[idx][0] += card.reward;
            } 
            else if (card.type == 'green') {
                if (!card.isMult) {
                    this.players[this.turn].rolls[idx][1] += card.reward;
                }
                else {
                    this.players[this.turn].rolls[idx][3] += card.reward;
                    this.players[this.turn].rolls[idx][4] = card.multCat;
                }
                if (card.category == 'store' && this.players[this.turn].progress[1]) {
                    this.players[this.turn].rolls[idx][1]++;
                }
            }
            else if (card.type == 'red') {
                this.players[this.turn].rolls[idx][2] += card.reward;
                if (this.players[this.turn].progress[1]) {
                    this.players[this.turn].rolls[idx][2]++;
                }
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

    purchaseLandmark(info) {
        let cost = [4, 10, 16, 22];
        this.players[this.turn].coins -= cost[info.landmark];
        this.players[this.turn].progress[info.landmark] = true;
        if (this.players[this.turn].progress[0] && this.players[this.turn].progress[1] && this.players[this.turn].progress[2] && this.players[this.turn].progress[3]) {
            this.gameOver = true;
            this.winner = this.players[this.turn];
        }
        else {
            if (info.landmark == 1) {
                for (let p of this.players[this.turn].cards) {
                    if (p.category == 'store') {
                        for (let i in p.roll) {
                            let idx = 'roll' + p.roll[i];
                            this.players[this.turn].rolls[idx][1]++;
                        }
                    }
                    else if (p.category == 'restaurant') {
                        for (let i in p.roll) {
                            let idx = 'roll' + p.roll[i];
                            this.players[this.turn].rolls[idx][2]++;
                        }
                    }
                }
            }
        }
    }

    switchTurns() {
        this.turn = (this.turn+1) % this.players.length;
        return this.players[this.turn].socketId;
    }
}

module.exports = MachiKoroGame;