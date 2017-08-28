const h = require('../helpers');

module.exports = (io, app) => {
    app.locals.chatrooms = [];
    let allrooms = app.locals.chatrooms;

    io.of("/roomslist").on("connection", socket => {
        socket.on("getChatrooms", () => {
            socket.emit("chatRoomsList", JSON.stringify(allrooms));
        });
        socket.on("createNewRoom", newRoomInput => {
            //check to see if a room with same titel exists
            if (!h.findRoomByName(allrooms, newRoomInput)) {
                // if not, create one and broadcast it to everyone
                allrooms.push({
                    room: newRoomInput,
                    roomID: h.randomHex(),
                    users: []
                });

                // socket.emit to creator of chatroom
                socket.emit("chatRoomsList", JSON.stringify(allrooms));
                // emit an updated list to everyone connected
                socket.broadcast.emit("chatRoomsList", JSON.stringify(allrooms));
            }
        })
    });

    io.of("/chatter").on("connection", socket => {
        socket.on("join", data => {
            let usersList = h.addUserToRoom(allrooms, data, socket);
            // update the list of active users
            if (usersList) {
                socket.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
                socket.emit('updateUsersList', JSON.stringify(usersList.users));
            } else {
                console.log("No users in channel.");
            }

        });
        socket.on("disconnect", () => {
            let room = h.removeUserFromRoom(allrooms, socket);
            if(room){
                socket.to(room.roomID).emit("updateUsersList", JSON.stringify(room.users));
            } else {
                console.log("No room, because last user left.");
            }


        });
        socket.on("newMessage", (data) => {
            socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
        })
    });
};