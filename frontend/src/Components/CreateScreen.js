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
        };
    }
    componentDidMount() {
        socket = socketIOClient(ENDPOINT);
        socket.emit("createRoom");

        socket.on("roomID", (roomID) => {
            this.setState({
                roomIDLoaded: true,
                roomID: roomID.roomID,
            });
        });
    }

    componentWillUnmount() {
        socket.emit("deleteRoom", {
            roomID: this.state.roomID,
        });
        socket.disconnect();
    }

    getScreen = () => {
        if (this.state.roomIDLoaded) {
            return (
                <div class="createScreen">
                    <h1>ROOM CREATED SUCCESSFULLY</h1>
                    <h2>YOUR ROOM ID:</h2>
                    <h2>{this.state.roomID}</h2>
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
                <h1>ROOM CREATED SUCCESSFULLY</h1>
                <h2>YOUR ROOM ID:</h2>
                <h2>LOADING</h2>
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
