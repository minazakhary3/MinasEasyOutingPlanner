import React from "react";
import CreateJoinScreen from "./CreateJoinScreen";
import CreateScreen from "./CreateScreen";
import JoinScreen from "./JoinScreen";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentState: "onCreateJoinScreen",
        };
    }

    updateCurrentScreen = (newScreen) => {
        this.setState({
            currentState: newScreen,
        });
    };

    getCurrentScreen() {
        switch (this.state.currentState) {
            case "onJoinScreen":
                return <JoinScreen updateFunction={this.updateCurrentScreen} />;
            case "onCreateScreen":
                return (
                    <CreateScreen updateFunction={this.updateCurrentScreen} />
                );
            case "onCreateJoinScreen":
                return (
                    <CreateJoinScreen
                        updateFunction={this.updateCurrentScreen}
                    />
                );
        }
    }

    render() {
        return (
            <div class="app">
                <div class="mainAppScreen">{this.getCurrentScreen()}</div>
            </div>
        );
    }
}

export default App;
