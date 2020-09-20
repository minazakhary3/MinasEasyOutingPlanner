import React from "react";
import axios from "axios";
import TinderCard from "react-tinder-card";
import socketIOClient from "socket.io-client";

const ENDPOINT = "192.168.1.21:8000";
var socket;

class RoomScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            joinedState: "joining",
        };
    }

    componentDidMount() {
        socket = socketIOClient(ENDPOINT);

        let info = {
            name: this.props.name,
            roomID: this.props.roomID,
        };
        socket.emit("joinRoom", info);

        socket.on("joinResponse", (res) => {
            if (res.exists) {
                this.setState({
                    joinedState: "success",
                    roomID: info.roomID,
                    userName: info.name,
                });

                axios
                    .get("http://192.168.1.21:8000/api/defaultoptions", {
                        params: { roomID: info.roomID },
                    })
                    .then((res) => {
                        this.setState({
                            joinedState: "loaded",
                            options: res.data.options,
                        });
                    });
            } else {
                this.setState({
                    joinedState: "invalidRoom",
                });
            }
        });

        socket.on("finishedVoting", () => {
            this.setState({
                joinedState: "finishedVoting",
            });
        });

        socket.on("roomClosed", () => {
            this.setState({
                joinedState: "roomClosed",
            });
        });

        socket.on("results", (info) => {
            this.setState({
                winner: info.winner,
                joinedState: "results",
            });
        });
    }

    componentWillUnmount() {
        socket.emit("leaveRoom", {
            roomID: this.props.roomID,
        });
        socket.disconnect();
    }

    onSwipe = (direction, name) => {
        console.log("You swiped " + name + " " + direction);
        socket.emit("swiped", {
            room: this.state.roomID,
            name: name,
            direction: direction,
            user: this.state.userName,
        });
    };

    getScreen = () => {
        switch (this.state.joinedState) {
            case "joining":
                return <h1>JOINING</h1>;
            case "invalidRoom":
                return <h1>INVALID</h1>;
            case "success":
                return <h1>Joined Successfully! Loading Room Data!</h1>;
            case "loaded":
                const options = this.state.options;
                return (
                    <div class="cardsContainer">
                        {options.map((option) => (
                            <TinderCard
                                onSwipe={(direction) =>
                                    this.onSwipe(direction, option.name)
                                }
                                preventSwipe={["up", "down"]}
                                flickOnSwipe="true"
                                className="tinder"
                            >
                                <div class="card">
                                    <h1>{option.name}</h1>
                                </div>
                            </TinderCard>
                        ))}
                    </div>
                );
            case "finishedVoting":
                return <h1>FINISHED VOTING!</h1>;
            case "results":
                return <h1>{this.state.winner} wins!</h1>;
            case "roomClosed":
                return <h1>ROOM CLOSED</h1>;
        }
    };

    render() {
        return (
            <div class="roomScreen">
                {this.getScreen()}
                <button onClick={() => this.props.leaveRoom()}>Go Back</button>
            </div>
        );
    }
}

export default RoomScreen;
