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
            options: [],
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
        this.state.options.forEach((option) => {
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

    addOption = (option) => {
        let currentArray = this.state.options;
        console.log(option);
        currentArray.push(option);
        this.setState({
            options: currentArray,
        });
    };

    removeOption = (option) => {
        let currentArray = this.state.options;
        currentArray.splice(currentArray.indexOf(option), 1);
        this.setState({
            options: currentArray,
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
                <div class="createForm">
                    <input
                        type="text"
                        placeholder="Number of Participants"
                        id="participants"
                        class="textInput"
                    ></input>
                    <div class="addOption">
                        <input
                            type="text"
                            placeholder="Option"
                            id="options"
                            class="textInput"
                        ></input>
                        <button
                            onClick={() =>
                                this.addOption(
                                    document.getElementById("options").value
                                )
                            }
                        >
                            Add
                        </button>
                    </div>
                    {this.state.options.map((option) => (
                        <h2>
                            {option}{" "}
                            <button
                                id={option}
                                onClick={() => this.removeOption(option)}
                            >
                                Remove
                            </button>
                        </h2>
                    ))}
                </div>
                <div class="buttonGroup">
                    <button
                        onClick={() => this.createRoom()}
                        class="inputButton"
                    >
                        Create Chamber
                    </button>
                    <button
                        class="inputButton"
                        onClick={() =>
                            this.props.updateFunction("onCreateJoinScreen")
                        }
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    };

    render() {
        return this.getScreen();
    }
}

export default CreateScreen;
