import React from "react";
import RoomScreen from "./RoomScreen";
import Header from "./Header";

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
                    <Header />
                    <div class="joinForm">
                        <input
                            type="text"
                            placeholder="Your Name"
                            id="name"
                            class="textInput"
                        ></input>
                        <input
                            type="text"
                            placeholder="Room ID"
                            id="roomID"
                            class="textInput"
                        ></input>
                        <button
                            class="inputButton"
                            onClick={() => this.joinRoom()}
                        >
                            Join
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
