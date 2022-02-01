import React from "react";
import BadgeList from "./BadgeList";
import "./Chat.scss"
import Emote from "./Messages/Emote";
import Text from "./Messages/Text";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.index = this.props.key;
        this.message = this.props.msg;
        this.user = this.props.user;
        this.userCardUrl = this.props.userCardUrl;
        this.badges = this.props.badgeList ? this.props.badgeList : [];
        this.chatClass = "chat-line__message tw-relative p-0 list-group-item bg-dark";
    }

    render() {
        return (
            <li className={this.chatClass} key={this.index}>
                <span className="text-light">{this.props.time} </span>
                <BadgeList key={`badges-list-${new Date().valueOf()}`} badges={this.badges}/>
                <a className="username" href={this.userCardUrl} style={this.user.style} target="_blank" rel="noreferrer">{this.user.username}</a>
                <span className="text-light">{this.message.map((msg, i) => typeof msg === "string" ?
                    <Text key={`${msg + i}-${new Date().valueOf()}`} msg={msg}/> :
                    <Emote key={`${msg + i}-${new Date().valueOf()}`} emote={msg}/>)}</span>
            </li>
        );
    }
}

export default Chat;
