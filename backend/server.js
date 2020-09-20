const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");

const port = process.env.PORT || "8000";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = socketIo(server);

server.listen(port, () => {
    console.log("RUNNING ON " + port);
});

var rooms = [];
var nameIDMap = new Map();

io.on("connection", (socket) => {
    console.log("A user has connected");

    let newRoom;

    socket.on("createRoom", () => {
        newRoom = {
            roomID: Math.floor(Math.random() * 10000),
            users: [],
            numOfOptions: 2,
        };
        rooms.push(newRoom);
        socket.emit("roomID", newRoom);

        console.log("Room: " + newRoom.roomID + " has been created.");
    });

    socket.on("deleteRoom", (room) => {
        console.log("Room: " + newRoom.roomID + " has been deleted.");
        rooms.splice(rooms.indexOf(newRoom));

        io.in(room.roomID).clients((err, clients) => {
            clients.forEach((client) => {
                socket.to(client).emit("roomClosed");
                console.log(nameIDMap.get(client));
            });
        });
    });

    socket.on("joinRoom", (info) => {
        let roomExists = false;
        rooms.forEach((room) => {
            if (room.roomID == parseInt(info.roomID)) {
                nameIDMap.set(socket.id, info.name);

                room.users.push({
                    name: info.name,
                    likes: [],
                    dislikes: [],
                    finishedVoting: false,
                });
                socket.join(room.roomID);

                roomExists = true;

                console.log(info.name + " has joined room: " + info.roomID);
            }
        });

        let response = {
            exists: roomExists,
        };

        socket.emit("joinResponse", response);
    });

    socket.on("leaveRoom", (room) => {
        socket.leave(room.roomID);
        console.log(
            nameIDMap.get(socket.id) + " has left room: " + room.roomID
        );
    });

    socket.on("swiped", (info) => {
        console.log(
            info.room +
                ": " +
                info.user +
                " has swiped " +
                info.direction +
                " on " +
                info.name
        );

        console.log(
            rooms.find((room) => {
                return room.roomID == info.room;
            })
        );

        if (info.direction == "right") {
            rooms
                .find((room) => {
                    return room.roomID == info.room;
                })
                .users.find((user) => {
                    return user.name == info.user;
                })
                .likes.push(info.name);
        } else if (info.direction == "left") {
            rooms
                .find((room) => {
                    return room.roomID == info.room;
                })
                .users.find((user) => {
                    return user.name == info.user;
                })
                .dislikes.push(info.name);
        }

        if (
            rooms
                .find((room) => {
                    return room.roomID == info.room;
                })
                .users.find((user) => {
                    return user.name == info.user;
                }).likes.length +
                rooms
                    .find((room) => {
                        return room.roomID == info.room;
                    })
                    .users.find((user) => {
                        return user.name == info.user;
                    }).dislikes.length ==
            rooms.find((room) => {
                return room.roomID == info.room;
            }).numOfOptions
        ) {
            console.log(info.user + " has finished voting!");
            rooms
                .find((room) => {
                    return room.roomID == info.room;
                })
                .users.find((user) => {
                    return user.name == info.user;
                }).finishedVoting = true;

            socket.emit("finishedVoting");
        }

        console.log(
            rooms
                .find((room) => {
                    return room.roomID == info.room;
                })
                .users.find((user) => {
                    return user.name == info.user;
                })
        );
    });

    socket.on("disconnect", () => {
        console.log("A user has disconnected.");
    });
});

app.get("/api/defaultoptions", (req, res) => {
    res.json({
        options: [
            {
                name: "CFC",
                imageURL:
                    "https://i.pinimg.com/originals/84/09/05/840905eaba2ebaf855a5ce5a883321e1.jpg",
            },
            {
                name: "Point 90",
                imageURL:
                    "https://rowad-rme.com/wp-content/uploads/2015/06/MSH_1666-1200x650.jpg",
            },
        ],
    });
});
