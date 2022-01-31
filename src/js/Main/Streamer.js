import React from "react";
import './Header.scss';

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


    render() {
        return (
            <div className="d-flex" id="header">
                <input className="form-control mr-4" id="streamer-input" onChange={this.changeHandler.bind(this)} placeholder="Enter Streamer"/>
                <button className="btn btn-primary p-1" id="enter-btn" onClick={this.clickHandler.bind(this)}>Enter Chat</button>
                <small className="px-4">{this.props.streamer}</small>
            </div>
        );
    }
}
export default Streamer;
