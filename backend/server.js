const express = require("express");
const socketIo = require("socket.io");
const http = require("http");

const port = process.env.PORT || "8000";

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

server.listen(port, () => {
    console.log("RUNNING ON " + port);
});

var rooms = [];

function getClients(roomID) {
    return new Promise((resolve, reject) => {
        io.of("/")
            .in(roomID)
            .clients((error, clients) => {
                if (error) return reject(error);

                resolve(clients);
            });
    });
}

io.on("connection", (socket) => {
    console.log("A user has connected");

    let newRoom;

    socket.on("createRoom", () => {
        newRoom = {
            roomID: Math.floor(Math.random() * 10000),
            users: [],
        };
        rooms.push(newRoom);
        socket.emit("roomID", newRoom);

        console.log("Room: " + newRoom.roomID + " has been created.");
    });

    socket.on("deleteRoom", (room) => {
        console.log("Room: " + newRoom.roomID + " has been deleted.");
        rooms.splice(rooms.indexOf(newRoom));

        console.log(rooms);

        io.in(room.roomID).clients((err, clients) => {
            console.log(clients);
        });
    });

    socket.on("joinRoom", (info) => {
        let roomExists = false;
        rooms.forEach((room) => {
            if (room.roomID == parseInt(info.roomID)) {
                room.users.push(info.name);
                socket.join(room.roomID);
                roomExists = true;
            }
        });

        let response = {
            exists: roomExists,
        };

        socket.emit("joinResponse", response);
    });

    socket.on("disconnect", () => {
        console.log("User has disconnected");
    });
});
