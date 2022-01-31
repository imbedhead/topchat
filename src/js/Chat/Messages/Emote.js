import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

class Emote extends React.Component {

    /**
     * Get the largest emote url to display in tooltip
     * @param url
     * @returns {string}
     */
    getLargeEmoteUrl(url) {
        return url.substring(url.lastIndexOf(",") + 1, url.lastIndexOf(" "))
    }

    render() {
        return (
            <span>
                <OverlayTrigger
                    key={`top-${new Date().valueOf()}`}
                    placement="top"
                    overlay={
                        <Tooltip id={`tooltip-${new Date().valueOf()}`}>
                            <div><img
                                src={this.getLargeEmoteUrl(this.props.emote.urls)}
                                alt={this.props.emote.name}/>
                                <div>{this.props.emote.name}</div>
                            </div>
                        </Tooltip>
                    }>
                        <img srcSet={this.props.emote.urls} alt={this.props.emote.name}/>
                    </OverlayTrigger>
            </span>
        );
    }
}

export default Emote;
