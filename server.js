const express = require('express');
const path = require('path');

const PORT = 8000;
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const session = require('express-session');
app.use(session({ secret: 'sdlfjadfljdslfk',
                  resave: false,
                  saveUninitialized: true } ));

app.use(express.static(path.join(__dirname, '/games/dist')));
app.use('/incan', express.static(path.join(__dirname, '/games/src/app/incan-gold/images')));
app.use('/machi', express.static(path.join(__dirname, '/games/src/app/machi/images')));

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);

app.count = 0; 

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

const io = require('socket.io').listen(server);

//dictionary of all games, key: <<gameId from DB>>
var games = {};

//incan gold namespace
const incan = io.of('/incan');
const IncanGame = require('./server/models/incanGold/incanGame.js');
const IncanDeck = require('./server/models/incanGold/incanDeck.js');
const IncanPlayer = require('./server/models/incanGold/incanPlayer.js');

incan.on('connection', (socket) => {

    socket.on('room', (roomInfo) => {
        socket.join(roomInfo.id);
        if (!games[roomInfo.id]) {
            let g = new IncanGame(roomInfo.id, roomInfo.cap);
            let p = new IncanPlayer(roomInfo.player.playerId, roomInfo.player.username, socket.id);
            g.players.push(p);
            //assume first play is to stay
            g.playersPlaying.push(roomInfo.player.playerId);
            games[roomInfo.id] = g;
        }
        else {
            let p = new IncanPlayer(roomInfo.player.playerId, roomInfo.player.username, socket.id);
            games[roomInfo.id].players.push(p);
            //assume first play is to stay
            games[roomInfo.id].playersPlaying.push(roomInfo.player.playerId);
            //once enough players are in, start game
            if (games[roomInfo.id].players.length == games[roomInfo.id].totalPlayers) {
                //first play is run
                games[roomInfo.id].updateStatus();
                incan.to(roomInfo.id).emit('startGame', games[roomInfo.id]);
            }
        }
    });

    socket.on('madeChoice', (c) => {
        //add choice to game
        let newRound = false;

        games[c.gameId].numResponses++;
        //player chooses to stay
        if (c.choice == 1) {
            games[c.gameId].playersPlaying.push(c.id);
        }
        //player chooses to leave
        else if (c.choice == 0) {
            games[c.gameId].playersAboutToLeave.push(c.id);
        }
        //assume all players playing at start of new round
        else if (c.choice == -1) { 
            games[c.gameId].playersPlaying.push(c.id);
            newRound = true;
        }

        //once all choices are in, update game 1x
        if (games[c.gameId].numResponses == games[c.gameId].totalPlayers) {
            if (newRound) { 
                games[c.gameId].startNewRound(); 
            }
            games[c.gameId].updateStatus();
            incan.to(c.gameId).emit('showCard', games[c.gameId]);
        }
    });
})
//end incan gold namespace

const machi = io.of('/machi');
const MachiGame = require('./server/models/machiKoro/machiKoroGame.js');
const MachiDeck = require('./server/models/machiKoro/machiKoroDeck.js');
const MachiPlayer = require('./server/models/machiKoro/machiKoroPlayer.js');

machi.on('connection', (socket) => {
    socket.on('mroom', (roomInfo) => {
        socket.join(roomInfo.id);
        if (!games[roomInfo.id]) {
            let g = new MachiGame(roomInfo.id, roomInfo.cap);
            let p = new MachiPlayer(roomInfo.player.playerId, roomInfo.player.username, socket.id);
            g.players.push(p);
            games[roomInfo.id] = g;
        }
        else {
            let existing = false;
            for (let existingPl of games[roomInfo.id].players) {
                if (existingPl.playerId == roomInfo.player.playerId) {
                    existing = true;
                    break;
                }
            }
            if (!existing) {
                let p = new MachiPlayer(roomInfo.player.playerId, roomInfo.player.username, socket.id);
                games[roomInfo.id].players.push(p);
                //once enough players are in, start game
                if (games[roomInfo.id].players.length == games[roomInfo.id].totalPlayers) {
                    machi.to(roomInfo.id).emit('startMKGame', games[roomInfo.id]);
                }
            }
        }
    });
    
    socket.on('rolled', (rollInfo) => {
        games[rollInfo.gameId].rollResults(rollInfo.rollVal1, rollInfo.rollVal2);
        machi.to(rollInfo.gameId).emit('gameUpdated', games[rollInfo.gameId]);
    });

    socket.on('purchased', (info) => {
        games[info.gameId].purchaseCard(info.card);
        let p = games[info.gameId].switchTurns();
        machi.to(info.gameId).emit('gameUpdated', games[info.gameId]);
    });

    socket.on('landmark', (info) => {
        let g = games[info.gameId];
        g.purchaseLandmark(info);
        if (!g.gameOver || !(g.players[g.turn].progress[2] && g.roll1 == g.roll2)) {
            games[info.gameId].switchTurns();
        }
        machi.to(info.gameId).emit('gameUpdated', g);
    });

    socket.on('passed', (info) => {
        games[info.gameId].switchTurns();
        machi.to(info.gameId).emit('gameUpdated', games[info.gameId]);
    });
})