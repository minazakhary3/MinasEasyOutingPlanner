import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";
import "./index.css";

const element = (
    <div class="container">
        <App />
    </div>
);

ReactDOM.render(element, document.getElementById("root"));
