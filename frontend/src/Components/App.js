import React from "react";
import CreateJoinScreen from "./CreateJoinScreen";
import CreateScreen from "./CreateScreen";
import JoinScreen from "./JoinScreen";
import Header from "./Header";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentState: "onCreateJoinScreen",
            pageName: "MEOP",
        };
    }

    updateCurrentScreen = (newScreen) => {
        this.setState({
            currentState: newScreen,
        });
    };

    getCurrentScreen = () => {
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
    };

    getPageName = () => {
        switch (this.state.currentState) {
            case "onJoinScreen":
                return "Join Chamber";
            case "onCreateScreen":
                return "Create Chamber";
            case "onCreateJoinScreen":
                return "Mina's Easy Outing Planner";
        }
    };

    render() {
        return (
            <div class="app">
                <div class="mainAppScreen">
                    <Header pageName={this.getPageName()} />
                    {this.getCurrentScreen()}
                </div>
            </div>
        );
    }
}

export default App;
