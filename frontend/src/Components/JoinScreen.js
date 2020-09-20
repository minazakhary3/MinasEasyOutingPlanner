import React from "react";
import RoomScreen from "./RoomScreen";

class JoinScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentScreen: "joinScreen",
        };
    }

    joinRoom = () => {
        this.setState({
            currentScreen: "roomScreen",
        });
    };

    leaveRoom = () => {
        this.props.updateFunction("onCreateJoinScreen");
    };

    getScreen = () => {
        if (this.state.currentScreen == "joinScreen") {
            return (
                <div class="createScreen">
                    <input
                        type="text"
                        placeholder="Your Name"
                        id="name"
                    ></input>
                    <input
                        type="text"
                        placeholder="Room ID"
                        id="roomID"
                    ></input>
                    <button onClick={() => this.joinRoom()}>Join</button>
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
            <RoomScreen
                name={document.getElementById("name").value}
                roomID={document.getElementById("roomID").value}
                leaveRoom={this.leaveRoom}
            />
        );
    };

    render() {
        return this.getScreen();
    }
}

export default JoinScreen;
