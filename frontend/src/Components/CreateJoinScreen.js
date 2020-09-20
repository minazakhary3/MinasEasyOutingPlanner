import React from "react";
import Header from "./Header";

class CreateJoinScreen extends React.Component {
    render() {
        return (
            <div class="createJoinScreen">
                <Header />
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
