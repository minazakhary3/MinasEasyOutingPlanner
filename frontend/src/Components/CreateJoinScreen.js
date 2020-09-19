import React from "react";

class CreateJoinScreen extends React.Component {
    render() {
        return (
            <div class="createJoinScreen">
                <button
                    class="mainButton"
                    onClick={() => this.props.updateFunction("onJoinScreen")}
                >
                    Join Voting Chamber
                </button>
                <button
                    class="mainButton"
                    onClick={() => this.props.updateFunction("onCreateScreen")}
                >
                    Create Voting Chamber
                </button>
            </div>
        );
    }
}

export default CreateJoinScreen;
