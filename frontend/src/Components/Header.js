import React from "react";

class Header extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div class="header">
                <h1>{this.props.pageName}</h1>
            </div>
        );
    }
}

export default Header;
