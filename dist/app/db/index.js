'use strict';

var config = require('../config');
var logger = require('../logger');
var Mongoose = require('mongoose');

Mongoose.Promise = global.Promise;

Mongoose.connect(config.dbURI, { useMongoClient: true });

Mongoose.connection.on('error', function (error) {
    logger.log("error", "Mongoose connection error: " + error);
});

// Create a Schema for storing user data

var chatUser = new Mongoose.Schema({
    profileId: String,
    fullName: String,
    profilePic: String
});

// turn Schema into a model
// by naming the model chatUser, mongodb will make a new collection of chatUsers (plural)
var userModel = Mongoose.model("chatUser", chatUser);

module.exports = {
    Mongoose: Mongoose,
    userModel: userModel
};
//# sourceMappingURL=index.js.map