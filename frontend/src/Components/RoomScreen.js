import React from "react";
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
                });
            } else {
                this.setState({
                    joinedState: "invalidRoom",
                });
            }
        });
    }

    componentWillUnmount() {
        socket.disconnect();
    }

    getScreen = () => {
        switch (this.state.joinedState) {
            case "joining":
                return <h1>JOINING</h1>;
            case "invalidRoom":
                return <h1>ROOM DOESN'T EXIST</h1>;
            case "success":
                return <h1>JOINED SUCCESSFULLY!</h1>;
        }
    };

    render() {
        return (
            <div class="roomScreen">
                {this.getScreen()}
                <button>Go Back</button>
            </div>
        );
    }
}

export default RoomScreen;
