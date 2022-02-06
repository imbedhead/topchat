import React from "react";
import Live from "./Live";

class Avatar extends React.Component {


    render() {
        return (
            <div>
                <a href={`https://www.twitch.tv/${this.props.streamer}`} target="_blank" rel="noreferrer"><img
                    id="streamer-avatar" src={this.props.link} alt="Streamer Avatar"/></a>
                <Live isLive={this.props.isLive}/>
            </div>
        );
    }
}

export default Avatar;
