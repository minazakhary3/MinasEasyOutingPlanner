import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import "./index.css";

const element = (
    <div class="container">
        <Header />
        <App />
        <Footer />
    </div>
);

ReactDOM.render(element, document.getElementById("root"));
