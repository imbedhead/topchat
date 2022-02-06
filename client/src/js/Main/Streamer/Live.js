import React from "react";
import './Live.scss';
import {Badge} from "react-bootstrap";

class Live extends React.Component {

    showLiveButton() {
        if (this.props.isLive) {
            return <div className="text-center"><Badge bg="danger">LIVE</Badge></div>;
        }
         return <div className="text-center"><Badge bg="secondary">Offline</Badge></div>;
    }


    render() {
        return (<div className="live-indicator">
            {this.showLiveButton()}
        </div>
        );
    }
}

export default Live;
