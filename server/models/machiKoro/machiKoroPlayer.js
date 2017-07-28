const MachiKoroCard = require('./machiKoroCard.js');

class MachiKoroPlayer {
    constructor(i, u, s) {
        this.id = i;
        this.username = u;
        this.socketId = s;
        this.cards = [];
        this.catCount = {grain: 1,
                         animal: 1,
                         store: 0, 
                         restaurant: 0,
                         gear: 0,
                         factory: 0,
                         plant: 0};
        this.coins = 3;
        this.progress = [false, false, false, false];
        this.cards.push(new MachiKoroCard('blue', 'Wheat Field', [1], 1, 1, 'grain'));
        this.cards.push(new MachiKoroCard('blue', 'Ranch', [2], 1, 1, 'animal'));
        this.rolls = {roll1: [1,0,0,0],
                      roll2: [0,1,0,0],
                      roll3: [0,1,0,0],
                      roll4: [0,0,0,0],
                      roll5: [0,0,0,0],
                      roll6: [0,0,0,0],
                      roll7: [0,0,0,0],
                      roll8: [0,0,0,0],
                      roll9: [0,0,0,0],
                     roll10: [0,0,0,0],
                     roll11: [0,0,0,0],
                     roll12: [0,0,0,0]}; //[blue roll, green roll, red roll, greenMult]
        this.majorEstablishments = {stadium: false, 
                                    tv: false,
                                    business: false,
                                    publisher: false,
                                    tax: false,
                                    renovation: false,
                                    tech: false,
                                    park: false};
    }
}

module.exports = MachiKoroPlayer;