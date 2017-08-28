"use strict";

var crypto = require("crypto");
var db = require("../db");

// find a single doc
var findOne = function findOne(profileID) {
    return db.userModel.findOne({
        "profileId": profileID
    });
};

//  create a new user and return that instance
var createNewUser = function createNewUser(profile) {
    return new Promise(function (resolve, reject) {
        var newChatUser = new db.userModel({
            profileId: profile.id,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value || ""
        });

        newChatUser.save(function (error) {
            if (error) {
                reject(error);
            } else {
                resolve(newChatUser);
            }
        });
    });
};

// findbyID
var findById = function findById(id) {
    return new Promise(function (resolve, reject) {
        db.userModel.findById(id, function (error, user) {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    });
};

// authentication verification
var isAuthenticated = function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/");
    }
};

// find a chatroom by name
var findRoomByName = function findRoomByName(allrooms, room) {
    var findRoom = allrooms.findIndex(function (element, index, array) {
        return element.room === room;
    });
    return findRoom > -1;
};

// find a chatroom by Id
var findRoomById = function findRoomById(allrooms, roomID) {
    return allrooms.find(function (element, index, array) {
        return element.roomID === roomID;
    });
};

// generate a unique room id
var randomHex = function randomHex() {
    return crypto.randomBytes(24).toString("hex");
};

// Add user to a chatroom
var addUserToRoom = function addUserToRoom(allrooms, data, socket) {
    // get the room object
    var getRoom = findRoomById(allrooms, data.roomID);
    if (getRoom !== undefined) {
        // get the active user's ID
        var userID = socket.request.session.passport.user;
        // check to see if this user already exists in room
        var checkUser = getRoom.users.findIndex(function (element, index, array) {
            return element.userID === userID;
        });
        // if user already in room, remove him first
        if (checkUser > -1) {
            getRoom.users.splice(checkUser, 1);
        }
        // push the user into the rooms users array
        getRoom.users.push({
            socketID: socket.id,
            userID: userID,
            user: data.user,
            userPic: data.userPic
        });
        // join the room channel
        socket.join(data.roomID);
        // return the updated room object
        return getRoom;
    }
};

// Find and purge the user when a socket disconnects
var removeUserFromRoom = function removeUserFromRoom(allrooms, socket) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = allrooms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var room = _step.value;

            // find user
            var findUser = room.users.findIndex(function (element, index, array) {
                return element.socketID === socket.id;
            });

            if (findUser > -1 && room.users.length > 1) {
                socket.leave(room.roomID);
                room.users.splice(findUser, 1);
                return room;
            } else {
                socket.leave(room.roomID);
                room.users.splice(findUser, 1);
                allrooms.splice(room, 1);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

module.exports = {
    findOne: findOne,
    createNewUser: createNewUser,
    findById: findById,
    isAuthenticated: isAuthenticated,
    findRoomByName: findRoomByName,
    randomHex: randomHex,
    findRoomById: findRoomById,
    addUserToRoom: addUserToRoom,
    removeUserFromRoom: removeUserFromRoom
};
//# sourceMappingURL=index.js.map