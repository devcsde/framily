const crypto = require("crypto");
const db = require("../db");

// find a single doc
let findOne = profileID => {
    return db.userModel.findOne({
        "profileId": profileID
    })
};

//  create a new user and return that instance
let createNewUser = profile => {
    return new Promise((resolve, reject) => {
        let newChatUser = new db.userModel({
            profileId: profile.id,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value || ""
        });

        newChatUser.save(error => {
            if (error) {
                reject(error);
            } else {
                resolve(newChatUser);
            }
        })
    })
};

// findbyID
let findById = id => {
    return new Promise((resolve, reject) => {
        db.userModel.findById(id, (error, user) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        })
    })
};

// authentication verification
let isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        next();
    } else {
        res.redirect("/");
    }
};

// find a chatroom by name
let findRoomByName = (allrooms, room) => {
    let findRoom = allrooms.findIndex((element, index, array) => {
        return element.room === room;
    });
    return findRoom > -1;
};

// find a chatroom by Id
let findRoomById = (allrooms, roomID) => {
    return allrooms.find((element, index, array) => {
        return element.roomID === roomID;
    });
};

// generate a unique room id
let randomHex = () => {
    return crypto.randomBytes(24).toString("hex");
};

// Add user to a chatroom
let addUserToRoom = (allrooms, data, socket) => {
    // get the room object
    let getRoom = findRoomById(allrooms, data.roomID);
    if(getRoom !== undefined){
        // get the active user's ID
        let userID = socket.request.session.passport.user;
        // check to see if this user already exists in room
        let checkUser = getRoom.users.findIndex((element, index, array) => {
            return element.userID === userID;
        });
        // if user already in room, remove him first
        if(checkUser > -1) {
            getRoom.users.splice(checkUser, 1);
        }
        // push the user into the rooms users array
        getRoom.users.push({
            socketID: socket.id,
            userID,
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
let removeUserFromRoom = (allrooms, socket) => {
    for(let room of allrooms) {
        // find user
        let findUser = room.users.findIndex((element, index, array) => {
            return element.socketID === socket.id;
        });

        if (findUser > -1 && room.users.length > 1) {
            socket.leave(room.roomID);
            room.users.splice(findUser, 1);
            return room;
        } else {
            socket.leave(room.roomID);
            room.users.splice(findUser, 1);
            allrooms.splice(room,1);
        }
    }
};



module.exports = {
    findOne,
    createNewUser,
    findById,
    isAuthenticated,
    findRoomByName,
    randomHex,
    findRoomById,
    addUserToRoom,
    removeUserFromRoom
};