import React from "react";
import Badge from "./Badge";

class BadgeList extends React.Component {
    constructor(props) {
        super(props);
        this.badges = this.props.badges;
    }

    render() {
        return (
            <span>
                {this.badges.map(badge => <Badge key={badge.key} badgeName={badge.name} className={badge.type}/>)}
            </span>
        );
    }
}

export default BadgeList;
