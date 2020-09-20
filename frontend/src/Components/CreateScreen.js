import React from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "192.168.1.21:8000";
var socket;
class CreateScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomIDLoaded: false,
            roomID: "0000",
            finishedVoting: [],
        };
    }
    componentDidMount() {
        socket = socketIOClient(ENDPOINT);

        /*
        
        */

        socket.on("userFinishedVoting", (info) => {
            let currentArray = this.state.finishedVoting;
            currentArray.push(info.name);
            this.setState({
                finishedVoting: currentArray,
            });
        });
    }

    componentWillUnmount() {
        socket.emit("deleteRoom", {
            roomID: this.state.roomID,
        });
        socket.disconnect();
    }

    createRoom = () => {
        let options = [];
        document
            .getElementById("options")
            .value.split(",")
            .forEach((option) => {
                options.push({
                    name: option,
                    users: [],
                });
            });
        socket.emit("createRoom", {
            options: options,
        });
        socket.on("roomID", (roomID) => {
            this.setState({
                roomIDLoaded: true,
                roomID: roomID.roomID,
            });
        });

        socket.on("results", (info) => {
            this.setState({
                results: true,
                winner: info.winner,
                roomIDLoaded: false,
            });
        });
    };

    getResults = () => {
        socket.emit("getResults", {
            roomID: this.state.roomID,
        });
    };

    getScreen = () => {
        if (this.state.roomIDLoaded) {
            return (
                <div class="createScreen">
                    <h1>ROOM CREATED SUCCESSFULLY</h1>
                    <h2>YOUR ROOM ID:</h2>
                    <h2>{this.state.roomID}</h2>
                    <div class="finishedVoting">
                        {this.state.finishedVoting.map((user) => (
                            <h1>{user} has finished voting!</h1>
                        ))}
                    </div>
                    <button onClick={() => this.getResults()}>
                        Get Results
                    </button>
                    <button
                        onClick={() =>
                            this.props.updateFunction("onCreateJoinScreen")
                        }
                    >
                        Go Back
                    </button>
                </div>
            );
        }
        if (this.state.results) {
            return (
                <div class="createScreen">
                    <h1>{this.state.winner} wins!</h1>
                    <button
                        onClick={() =>
                            this.props.updateFunction("onCreateJoinScreen")
                        }
                    >
                        Go Back
                    </button>
                </div>
            );
        }
        return (
            <div class="createScreen">
                <h1>Room Settings</h1>
                <input
                    type="text"
                    placeholder="choices separated by commas"
                    id="options"
                ></input>
                <button onClick={() => this.createRoom()}>Create Room</button>
                <button
                    onClick={() =>
                        this.props.updateFunction("onCreateJoinScreen")
                    }
                >
                    Go Back
                </button>
            </div>
        );
    };

    render() {
        return this.getScreen();
    }
}

export default CreateScreen;
