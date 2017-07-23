class IncanPlayer {
    constructor(i, u, s) {
        this.id = i;
        this.username = u;
        this.socketId = s;
        this.totalTreasure = 0;
        this.currentTreasure = 0;
    }
}

module.exports = IncanPlayer;