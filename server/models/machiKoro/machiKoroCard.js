class MachiKoroCard {
    constructor(type, name, roll, cost, reward, cat, sn) {
        this.type = type;
        this.name = name;
        this.roll = roll;
        this.cost = cost;
        this.reward = reward;
        this.category = cat;
        this.shortName = sn;
        this.image = `/machi/${this.shortName}.jpg`;
    }
    
}

module.exports = MachiKoroCard;