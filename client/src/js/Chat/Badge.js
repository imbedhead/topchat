import React from "react";
import "./Badge.scss"
import {OverlayTrigger, Tooltip} from "react-bootstrap";

class Badge extends React.Component {
    constructor(props) {
        super(props);
        this.badgeType = "chat-badge " + this.props.className;
        this.key = this.props.key;
    }

    /**
     * Get the url of the largest badge img for the tooltip
     * @returns {string}
     */
    getBadgeTooltipUrl() {
        return `https://cdn.frankerfacez.com/static/badges/twitch/2/${this.props.badgeName.toLowerCase()}/1/4.png`
    }

    render() {
        return (

            <OverlayTrigger
                key={`badge-top-${new Date().valueOf()}`}
                placement="top"
                overlay={
                    <Tooltip id={`tooltip-badge-${new Date().valueOf()}`}>
                        <img className={this.badgeType} src={this.getBadgeTooltipUrl()} alt={this.props.badgeName}/>
                        <div>{this.props.badgeName}</div>
                    </Tooltip>
                }>
                <span key={this.key} className={this.badgeType}/>
            </OverlayTrigger>
        );
    }
}

export default Badge;
