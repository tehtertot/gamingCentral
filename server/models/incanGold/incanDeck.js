const IncanCard = require('./incanCard.js');

class IncanDeck {
    constructor() {
        this.cards = [];
        this.inPlay = [];
        this.artifacts = [];
        this.setDeck();
        this.addArtifact();
        this.shuffle();
    }

    setDeck() {
        let hazards = ['gas', 'monster', 'cavein', 'flood', 'fire'];
        let treasure = ['emerald', 'amethyst', 'topaz', 'ruby', 'sapphire'];
        for (let i = 0; i < 15; i++) {
            this.cards.push(new IncanCard('hazard', hazards[(i%5)], 0));
            this.cards.push(new IncanCard('treasure', treasure[(i%5)], i+1));
        }
        for (let i = 0; i < 5; i++) {
            if (i < 2) {
                this.artifacts.push(new IncanCard('artifact', 'gold', 10));
            }
            else {
                this.artifacts.push(new IncanCard('artifact', 'diamond', 5));
            }
        }
    }

    addArtifact() {
        this.cards.push(this.artifacts.pop());
    }

    shuffle() {
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < this.cards.length; i++) {
                let random = Math.floor(Math.random()*this.cards.length);
                let temp = this.cards[i];
                this.cards[i] = this.cards[random];
                this.cards[random] = temp;
            }
        }
    }

    drawCard() {
        let card = this.cards.pop();
        this.inPlay.push(card);
        return card;
    }

    newRoundDeck(removeHazard) {
        console.log("reshuffling deck");
        //remove last card if round ended due to double hazard
        if (removeHazard) {
            this.inPlay.pop();
        }
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].type == 'artifact') {
                this.cards.splice(i, 1);
                i--;
            }
        }
        //put all (other) inplay cards back into deck and reshuffle
        this.cards = this.cards.concat(this.inPlay);
        this.inPlay = [];
        this.addArtifact();
        this.shuffle();
        console.log(`Cards: ${this.cards.length}, ${this.inPlay.length}`);
    }
}

module.exports = IncanDeck;