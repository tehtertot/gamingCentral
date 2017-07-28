class MachiKoroCard {
    constructor(type, name, roll, cost, reward, cat, sn, isMult, multCat='') {
        this.type = type;
        this.name = name;
        this.roll = roll;
        this.cost = cost;
        this.reward = reward;
        this.isMult = isMult;
        this.multCat = multCat;
        this.category = cat;
        this.shortName = sn;
        this.image = `/machi/${this.shortName}.jpg`;
    }
    
}

module.exports = MachiKoroCard;