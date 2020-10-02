const express = require("express");
const subdomain = require("express-subdomain");
const socketIo = require("socket.io");
const http = require("http");
const path = require("path");
const cors = require("cors");
const router = express.Router();

const port = process.env.PORT || "8000";

const app = express();
app.use(
    subdomain("planner", express.static(path.join(__dirname, "frontend/build")))
);
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

    socket.on("createRoom", (info) => {
        newRoom = {
            roomID: Math.floor(Math.random() * 10000),
            users: [],
            numOfOptions: info.options.length,
            host: socket.id,
            options: info.options,
        };
        rooms.push(newRoom);
        socket.emit("roomID", newRoom);

        console.log("Room: " + newRoom.roomID + " has been created.");
    });

    socket.on("deleteRoom", (room) => {
        if (newRoom != null) {
            console.log("Room: " + newRoom.roomID + " has been deleted.");
        }

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

        room = rooms.find((room) => {
            return room.roomID == info.room;
        });
        console.log(room);

        if (info.direction == "right") {
            room.users
                .find((user) => {
                    return user.name == info.user;
                })
                .likes.push(info.name);
        } else if (info.direction == "left") {
            room.users
                .find((user) => {
                    return user.name == info.user;
                })
                .dislikes.push(info.name);
        }

        if (
            room.users.find((user) => {
                return user.name == info.user;
            }).likes.length +
                room.users.find((user) => {
                    return user.name == info.user;
                }).dislikes.length ==
            room.numOfOptions
        ) {
            console.log(info.user + " has finished voting!");
            room.users.find((user) => {
                return user.name == info.user;
            }).finishedVoting = true;

            socket.emit("finishedVoting");
            socket.to(room.host).emit("userFinishedVoting", {
                name: info.user,
            });
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

    socket.on("getResults", (info) => {
        console.log("Getting Results for: ");
        let room = rooms.find((room) => {
            return room.roomID == info.roomID;
        });

        users = room.users.filter((user) => {
            return user.finishedVoting == true;
        });

        room.options.forEach((option) => {
            room.users.forEach((user) => {
                if (user.likes.includes(option.name)) {
                    option.users.push(user.name);
                }
            });
        });

        let maxOption;
        let maxUsers = 0;

        room.options.forEach((option) => {
            if (option.users.length > maxUsers) {
                maxUsers = option.users.length;
                maxOption = option.name;
            }
        });

        console.log(maxOption + " wins!");

        socket.emit("results", {
            winner: maxOption,
        });

        io.in(info.roomID).clients((err, clients) => {
            clients.forEach((client) => {
                socket.to(client).emit("results", {
                    winner: maxOption,
                });
                console.log(nameIDMap.get(client));
            });
        });
    });

    socket.on("disconnect", () => {
        console.log("A user has disconnected.");
    });
});

app.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
    res.send("Under Construction, thx");
});

app.get("/api/defaultoptions", (req, res) => {
    let options = rooms.find((room) => {
        return room.roomID == req.query.roomID;
    });
    console.log(options);
    res.json(options);
});
