import React from "react";
import './Streamer.scss';
import {Spinner} from "react-bootstrap";
import Avatar from "./Avatar";

class Streamer extends React.Component {

    showActiveConnection() {
        if (this.props.data.displayName === "No Connection") {
            return <div className="d-flex" id="streamer-data">
                {this.props.data.displayName}
            </div>
        }
        if (this.props.data.invalid) {
            return <div className="d-flex streamer-not-found" id="streamer-data">
                {this.props.data.displayName}
            </div>
        }
        if (this.props.data.isLoading) {
            return <Spinner animation="border" variant="primary"/>;
        }
        return <div className="connected d-flex" id="streamer-data">
            <Avatar streamer={this.props.data.displayName}link={this.props.data.avatar} isLive={this.props.isLive}/>
            <span className="mx-1">{this.props.data.displayName}</span>
        </div>;
    }


    render() {
        return (
            <div className="ml-auto">{this.showActiveConnection()}</div>
        );
    }
}

export default Streamer;
