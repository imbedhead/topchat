import React from "react";
import "./Badge.scss"
import {OverlayTrigger, Tooltip} from "react-bootstrap";

class Badge extends React.Component {
    constructor(props) {
        super(props);
        this.badgeType = "chat-badge " + this.props.className;
        this.key = this.props.key;
    }

    render() {
        return (

            <OverlayTrigger
                key={`badge-top-${new Date().valueOf()}`}
                placement="top"
                overlay={
                    <Tooltip id={`tooltip-badge-${new Date().valueOf()}`}>
                        <span className={`${this.badgeType} tooltip-badge`}/>
                        <div>{this.props.badgeName}</div>
                    </Tooltip>
                }>
                <span key={this.key} className={this.badgeType}/>
            </OverlayTrigger>
        );
    }
}

export default Badge;
