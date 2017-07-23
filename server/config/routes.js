const path = require('path');
const users = require('../controllers/user_ctrl.js');
const games = require('../controllers/game_ctrl.js');

module.exports = (app) => {
    app.get('/logout', users.logout);
    app.get('/userInfo', users.info);
    app.post('/register', users.register);
    app.post('/login', users.login);

    app.get('/allOpen', games.allOpenGames);
    app.post('/startGame', games.start);
    app.post('/joinGame', games.join);

    app.all('*', (req, res, next) => {
        res.sendFile(path.resolve('./games/dist/index.html'));
    })
}