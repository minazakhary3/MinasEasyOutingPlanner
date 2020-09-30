import React from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:8000/";
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
    }

    componentWillUnmount() {
        socket.emit("deleteRoom", {
            roomID: this.state.roomID,
        });
        socket.disconnect();
    }

    createRoom = () => {
        let options = [];
        console.log("PRESSED");
        this.state.options.forEach((option) => {
            options.push({
                name: option,
                users: [],
            });
        });
        if (this.state.options.length > 0) {
            socket.emit("createRoom", {
                options: options,
            });
        }
    };

    getResults = () => {
        socket.emit("getResults", {
            roomID: this.state.roomID,
        });
    };

    addOption = (option) => {
        if (/\S/.test(option) && this.state.options.indexOf(option) == -1) {
            document.getElementById("options").value = "";
            document.getElementById("options").focus();
            let currentArray = this.state.options;
            console.log(option);
            currentArray.push(option);
            this.setState({
                options: currentArray,
            });
        } else {
            //RED HIGHLIGHT TO BE IMPLEMENTED
        }
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
                <div class="chamberScreen">
                    <div class="chamberCreated">
                        <h3>CHAMBER ID:</h3>
                        <h2>{this.state.roomID}</h2>
                    </div>
                    <div class="finishedVoting">
                        <h2>Finished Voting:</h2>
                        {this.state.finishedVoting.map((user) => (
                            <h1>{user}</h1>
                        ))}
                    </div>
                    <div class="buttonGroup">
                        <button
                            onClick={() => this.getResults()}
                            class="inputButton"
                        >
                            Get Results
                        </button>
                        <button
                            class="inputButton"
                            onClick={() =>
                                this.props.updateFunction("onCreateJoinScreen")
                            }
                        >
                            End Chamber
                        </button>
                    </div>
                </div>
            );
        }
        if (this.state.results) {
            return (
                <div class="winnerScreen">
                    <h1>{this.state.winner} wins!</h1>
                    <button
                        class="inputButton"
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
                            class="textInputButton"
                        ></input>
                        <button
                            class="addButton"
                            onClick={() =>
                                this.addOption(
                                    document.getElementById("options").value
                                )
                            }
                        >
                            Add
                        </button>
                    </div>
                </div>
                <div class="optionsGroup">
                    <h2>Options</h2>
                    {this.state.options.map((option) => (
                        <div class="addedOption">
                            {option}{" "}
                            <button
                                id={option}
                                onClick={() => this.removeOption(option)}
                            >
                                Remove
                            </button>
                        </div>
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
