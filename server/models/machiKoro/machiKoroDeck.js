const MachiKoroCard = require('./machiKoroCard.js');

class MachiKoroDeck {
    constructor() {
        this.cards = [];
        this.inPlay = [];
        this.unique = 0;
        this.setDeck();
        this.shuffle();
        this.drawCard();
    }

    setDeck() {
        for (let i = 0; i < 15; i++) {
            this.cards.push(new MachiKoroCard('blue', 'Wheat Field', [1], 1, 1, 'grain'));
            this.cards.push(new MachiKoroCard('blue', 'Ranch', [2], 1, 1, 'animal'));
            this.cards.push(new MachiKoroCard('green', 'Bakery', [2, 3], 1, 1, 'store'));
            this.cards.push(new MachiKoroCard('red', 'Cafe', [3], 2, 1, 'restaurant'));
            this.cards.push(new MachiKoroCard('green', 'Convenience Store', [4], 2, 3, 'store'));
            this.cards.push(new MachiKoroCard('blue', 'Forest', [5], 3, 1, 'gear'));
            this.cards.push(new MachiKoroCard('purple', 'Stadium', [6], 6, 2, 'special'));
            this.cards.push(new MachiKoroCard('purple', 'TV Station', [6], 7, 3, 'special'));
            this.cards.push(new MachiKoroCard('purple', 'Business Center', [6], 8, 0, 'special'));
            this.cards.push(new MachiKoroCard('green', 'Cheese Factory', [7], 5, 3, 'factory'));
            this.cards.push(new MachiKoroCard('green', 'Furniture Factory', [8], 3, 3, 'factory'));
            this.cards.push(new MachiKoroCard('blue', 'Mine', [9], 6, 5, 'gear'));
            this.cards.push(new MachiKoroCard('blue', 'Apple Orchard', [10], 3, 3, 'grain'));
            this.cards.push(new MachiKoroCard('red', 'Family Restaurant', [9, 10], 3, 2, 'restaraunt'));
            this.cards.push(new MachiKoroCard('green', 'Fruit and Vegetable Market', [11, 12], 2, 2, '?'));
        }
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
        while (this.unique < 10 && this.cards.length > 0) {
            let card = this.cards.pop();
            if (!this.inPlay.includes(card)) {
                this.unique++;
            }
            this.inPlay.push(card);
        }
    }
}

module.exports = MachiKoroDeck;