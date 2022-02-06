import React from "react";
import './Header.scss';
import Streamer from "./Streamer/Streamer";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {streamerInput : ""}
    }

    changeHandler(e) {
        this.setState({streamerInput : e.target.value});
    }

    keyPressHandler(e) {
        if (e.charCode === 13) {
            this.clickHandler();
        }
    }

    clickHandler() {
        this.props.onClickHandler(this.state.streamerInput);
    }


    render() {
        return (
            <div className="d-flex" id="header">
                <input className="form-control mr-4" id="streamer-input" onKeyPress={this.keyPressHandler.bind(this)} onChange={this.changeHandler.bind(this)} placeholder="Enter Streamer"/>
                <button className="btn btn-primary p-1" id="enter-btn" onClick={this.clickHandler.bind(this)}>Join</button>
                <Streamer data={this.props.streamer} isLive={this.props.isLive}/>
            </div>
        );
    }
}
export default Header;
