const config = require('../config');
const logger = require('../logger');
const Mongoose = require('mongoose');

Mongoose.Promise = global.Promise;

Mongoose.connect(config.dbURI, {useMongoClient: true,});

Mongoose.connection.on('error', error => {
    logger.log("error", "Mongoose connection error: " + error);
});

// Create a Schema for storing user data

const chatUser = new Mongoose.Schema({
    profileId: String,
    fullName: String,
    profilePic: String
});

// turn Schema into a model
// by naming the model chatUser, mongodb will make a new collection of chatUsers (plural)
let userModel = Mongoose.model("chatUser", chatUser);

module.exports = {
    Mongoose,
    userModel
};
