import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";
import "./index.css";

const element = (
    <div class="container">
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
        ></meta>
        <App />
    </div>
);

ReactDOM.render(element, document.getElementById("root"));
