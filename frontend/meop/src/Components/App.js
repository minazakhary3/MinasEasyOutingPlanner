import React from "react";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstButton: true,
        };
    }
    buttonClicked = () => {
        this.setState({
            firstButton: !this.state.firstButton,
        });
    };

    getButton() {
        if (this.state.firstButton) {
            return (
                <button onClick={this.buttonClicked} class="btn btn-primary">
                    First Button
                </button>
            );
        }
        return <button onClick={this.buttonClicked}>Second Button</button>;
    }

    render() {
        return <div class="app">{this.getButton()}</div>;
    }
}

export default App;
