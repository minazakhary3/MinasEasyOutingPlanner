import React from "react";

class CreateJoinScreen extends React.Component {
    render() {
        return (
            <div class="createJoinScreen">
                <img
                    src={require("../BarneyWink.png")}
                    alt="Barney Winking"
                    class="barney"
                ></img>
                <div class="buttonGroup">
                    <button
                        class="mainButton"
                        onClick={() =>
                            this.props.updateFunction("onJoinScreen")
                        }
                    >
                        Join Voting Chamber
                    </button>
                    <button
                        class="mainButton"
                        onClick={() =>
                            this.props.updateFunction("onCreateScreen")
                        }
                    >
                        Create Voting Chamber
                    </button>
                </div>
            </div>
        );
    }
}

export default CreateJoinScreen;
