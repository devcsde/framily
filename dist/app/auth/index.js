"use strict";

var passport = require("passport");
var config = require("../config");
var logger = require("../logger");
var FacebookStrategy = require("passport-facebook").Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var h = require('../helpers');

module.exports = function () {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        h.findById(id).then(function (user) {
            return done(null, user);
        }).catch(function (error) {
            return logger.log("error", "User not found" + error);
        });
    });

    var authProcessor = function authProcessor(accessToken, refreshToken, profile, done) {
        h.findOne(profile.id).then(function (result) {
            if (result) {
                done(null, result);
            } else {
                // create new user and return
                h.createNewUser(profile).then(function (newChatUser) {
                    return done(null, newChatUser);
                }).catch(function (error) {
                    return logger.log("error", "Error when creating new user" + error);
                });
            }
        });
    };
    passport.use(new FacebookStrategy(config.fb, authProcessor));
    passport.use(new GoogleStrategy(config.google, authProcessor));
    passport.use(new TwitterStrategy(config.twitter, authProcessor));
};
//# sourceMappingURL=index.js.map