import React from "react";
import Clip from "./Clip";

class Link extends React.Component {

    /**
     * Check if given link is a Twitch clip to embed
     * @param url
     * @returns {boolean}
     */
    isClip(url) {
        return url.indexOf("clips.twitch.tv") >= 0;
    }

    render() {
        return (
            <span key={`link-${new Date().valueOf()}`}>
                {this.isClip(this.props.url) ? <Clip url={this.props.url}/> :
                    <a href={this.props.url} target="_blank" rel="noreferrer">{this.props.url}</a>}
            </span>
        );
    }
}

export default Link;
