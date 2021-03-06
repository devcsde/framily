'use strict';

var express = require('express');
var passport = require("passport");
var router = express.Router();
var h = require('../helpers');
var config = require("../config");

//////////////
// GET ROUTES
router.get('/', function (req, res, next) {
    res.render('login', {
        title: "Fr'amily | Login"
    });
});

router.get('/rooms', h.isAuthenticated, function (req, res, next) {
    res.render('rooms', {
        title: "Fr'amily | Rooms",
        host: config.host,
        user: req.user
    });
});

router.get('/chat/:id', h.isAuthenticated, function (req, res, next) {
    // find a chatroom with given id
    // render if the id is found
    var getRoom = h.findRoomById(req.app.locals.chatrooms, req.params.id);
    if (getRoom === undefined) {
        return next();
    } else {
        res.render('chatroom', {
            title: "Fr'amily | Chat",
            host: config.host,
            user: req.user,
            room: getRoom.room,
            roomID: getRoom.roomID
        });
    }
});

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/rooms');
});

router.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
    res.redirect('/rooms');
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function (req, res) {
    res.redirect('/rooms');
});

///////////////
// POST ROUTES


//////////////////////////////////////////
// CATCH ALL ROUTES WHICH ARE NOT DEFINED
router.all('*', h.isAuthenticated, function (req, res, next) {
    res.render('404', {
        title: "Fr'amily | Not Found"
    });
});

module.exports = router;
//# sourceMappingURL=index.js.map