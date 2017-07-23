const mongoose = require('mongoose');
const User = mongoose.model('User');
const session = require('express-session');
const bcrypt = require('bcrypt');

mongoose.Promise = global.Promise;

module.exports = {
    register: (req, res, next) => {
        let u = new User(req.body);
        u.save()
        .then((user) => {
            req.session.username = user.username;
            req.session.user_id = user._id;
            res.json(true);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
    },
    login: (req, res, next) => { 
        User.findOne({email: req.body.email.toLowerCase()})
        .then((user) => {
            if (!user) {
                res.status(400).json(false);
            }
            else if (!bcrypt.compareSync(req.body.password, user.password)) {
                res.status(401).json(false);
            }
            else {
                req.session.username = user.username;
                req.session.user_id = user._id;
                res.json(true);
            }
        })
        .catch((err) => { res.status(500).json(err); });
    },
    info: (req, res, next) => {
        let userInfo = {username: req.session.username, id: req.session.user_id};
        res.json(userInfo);
    },
    logout: (req, res, next) => {
        req.session.destroy();
        res.redirect('/');
    },
}