const mongoose = require('mongoose');
const Game = mongoose.model('Game');

mongoose.Promise = global.Promise;

module.exports = {
    allOpenGames: (req, res, next) => {
        Game.find({status: 0})
        .then((games) => { res.json(games); })
        .catch((err) => { res.status(500).json(err); });
    },
    start: (req, res, next) => {
        let g = new Game(req.body);
        g.save()
        .then((game) => { res.json(game); })
        .catch((err) => { res.status(500).json(err); });
    },
    join: (req, res, next) => {
        let user = {id: req.session.user_id, username: req.session.username};
        Game.findByIdAndUpdate(req.body._id, {$push: {players: user}})
        .then(() => { res.json(true); })
        .catch((err) => { res.status(500).json(err); });
    }
}