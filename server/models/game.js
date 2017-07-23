const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    selection: {type: String},
    numPlayers: {type: Number},
    players: {type: Array},
    status: {type: Number}

})

mongoose.model('Game', GameSchema);