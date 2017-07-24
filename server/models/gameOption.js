const mongoose = require('mongoose');

const GameOptionSchema = new mongoose.Schema({
    name: {type: String},
    goal: {type: String},
    rules: {type: String},
    minPlayers: {type: Number},
    maxPlayers: {type: Number},
    img: {type: String}

})

mongoose.model('GameOption', GameOptionSchema);