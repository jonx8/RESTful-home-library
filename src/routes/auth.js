const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../auth')
const users = require('../../users.json');

auth.init(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
)

router.get('/login', (req, res) => {
    res.render('login-page', {authMessage: req.session.message});
});

router.post('/login/password', (req, res) => {
    passport.authenticate('local', {}, (err, user, info) => {
        if (err) return res.sendStatus(500);
        if (!user) {
            req.session.message = info.message;
            return res.redirect('login');
        }
        req.logIn(user, function (err) {
            if (err) return err;
            res.redirect('/');
        })
    })(req, res);
});

router.get('/logout', (req, res) => {
    req.logOut(function (err) {
        if (err) return res.sendStatus(500);
        res.redirect('/login');
    });
});

module.exports = router;