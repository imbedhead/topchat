import React from "react";
import './Header.scss';
import {Badge} from "react-bootstrap";

class Streamer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {streamerInput : ""}
    }

    changeHandler(e) {
        this.setState({streamerInput : e.target.value});
    }

    clickHandler() {
        this.props.onClickHandler(this.state.streamerInput);
    }

    showActiveConnection() {
        if (!this.props.streamer || this.props.streamer === "No Active Stream") {
            return <Badge id="streamer-name" bg="dark">{this.props.streamer}</Badge>
        }
        if (this.props.streamer.includes(" ")) {
            return <Badge id="streamer-name" bg="danger">{this.props.streamer}</Badge>
        }
        return <Badge id="streamer-name" bg="success">{this.props.streamer}</Badge>;
    }


    render() {
        return (
            <div className="d-flex" id="header">
                <input className="form-control mr-4" id="streamer-input" onChange={this.changeHandler.bind(this)} placeholder="Enter Streamer"/>
                <button className="btn btn-primary p-1" id="enter-btn" onClick={this.clickHandler.bind(this)}>Enter Chat</button>
                {this.showActiveConnection()}
            </div>
        );
    }
}
export default Streamer;
