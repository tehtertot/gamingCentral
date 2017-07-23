const IncanDeck = require('./incanDeck.js');

class IncanGame {
    constructor(id, totalPlayers) {
        this.id = id;
        this.round = 1;
        this.players = [];
        this.deck = new IncanDeck();
        this.roundTreasure = 0;
        this.playersPlaying = [];
        this.playersAboutToLeave = [];
        this.playersWhoLeft = [];
        this.numResponses = 0;
        this.doubleHazard = false;
        this.roundOver = false;
        this.gameOver = false;
        this.totalPlayers = totalPlayers;   //initial input from first user for number of players
    }

    updateStatus() {        
        //any players choosing to leave
        if(this.playersAboutToLeave.length > 0) {
            for (let p of this.players) {
                if (this.playersAboutToLeave.includes(p.id)) {
                    p.totalTreasure += Math.floor(this.roundTreasure / this.playersAboutToLeave.length) + p.currentTreasure;
                    p.currentTreasure = null;
                }
            }
            //decrease amount of available treasure on the table
            this.roundTreasure = this.roundTreasure % this.playersAboutToLeave.length;

            //move players from leaving to left; check to see whether the round is over
            this.playersWhoLeft = this.playersWhoLeft.concat(this.playersAboutToLeave);
            this.playersAboutToLeave = [];
            if (this.playersWhoLeft.length == this.players.length) {
                this.roundOver = true;
            }
        }

        //any players choosing to stay
        if(this.playersPlaying.length > 0) {
            let c = this.deck.drawCard();
            
            //for hazard card
            if (c.value == 0 && c.type == 'hazard') {
                //check to see whether the card drawn is the second hazard
                let hazardCount = this.deck.inPlay.reduce( function(n, hazard) {
                    return n + (hazard.name == c.name);
                }, 0);
                //if double hazard
                if (hazardCount == 2) {
                    this.doubleHazard = true;
                    for (let p of this.players) {
                        p.currentTreasure = null;
                    }
                    this.roundOver = true;
                }
                //if single hazard
                else {
                    this.playersPlaying = [];
                }
            }
            //for treasure card
            else {      
                for (let p of this.players) {
                    console.log("dividing treasure between: ", this.playersPlaying);
                    if (this.playersPlaying.includes(p.id)) {
                        p.currentTreasure += Math.floor(c.value / this.playersPlaying.length);
                        console.log("player gets:", Math.floor(c.value / this.playersPlaying.length));
                    }
                }
                //add to treasure on the table; reset players
                this.roundTreasure += c.value % this.playersPlaying.length;
                this.playersPlaying = [];
            }
        }

        //reset number of expected responses
        if (this.roundOver) {
            if(this.round == 5) {
                this.gameOver = true;
                this.setWinnerOrder();
            }
            this.numResponses = 0;
        }
        else {
            this.numResponses = this.playersWhoLeft.length;
        }
    }

    startNewRound() {
        this.round++;
        for (let p of this.players) {
            p.currentTreasure = 0;
        }
        this.roundTreasure = 0;
        this.playersAboutToLeave = [];
        this.playersWhoLeft = [];
        this.deck.newRoundDeck(this.doubleHazard);
        this.doubleHazard = false;
        this.roundOver = false;
    }

    setWinnerOrder() {
        this.players.sort((a, b) => {
            return b.totalTreasure - a.totalTreasure;
        })
    }
}

module.exports = IncanGame;