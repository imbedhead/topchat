import React from "react";
import Chat from "../Chat/Chat";
import {Col, Container, Row} from "react-bootstrap";
import Header from "./Header";

let needsScroll = false;
let list;
let lastStreamer = "";
class Main extends React.Component {
    scrollNeeded() {
        // If we are switch streamers, the list will be empted and we won't need to scroll yet
        if (lastStreamer.toLowerCase() !== this.props.streamer.displayName.toLowerCase()) {
            lastStreamer = this.props.streamer.displayName;
            needsScroll = false;
        } else if (!needsScroll) {
            // If we don't already need to scroll, check if we will need to now
            needsScroll = list.offsetHeight < [...list.children].reduce((prev, curr) => prev + curr.offsetHeight, 0);
        }
        return needsScroll;
    }
    scrollToBottom(){
        if (this.scrollNeeded()) {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
    }

    componentDidMount() {
        list = document.getElementById("top-chat");
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }


    render() {
        return (
            <Container fluid>
                <Header onClickHandler={this.props.streamerClickHandler} streamer={this.props.streamer}/>
                <Row>
                    <Col lg={6} md={12} className="pr-0">
                        <small className="text-light">TOP CHAT</small>
                        <ul id="top-chat" className="list-group">
                            {this.props.msgs.map(msg => <Chat key={msg.key} time={msg.time} userCardUrl={msg.userCardUrl} badgeList={msg.badgeList} msg={msg.msg} user={msg.user}/>)}

                            <li style={{ float:"left", clear: "both" }}
                                 ref={(el) => { this.messagesEnd = el; }}>
                            </li>
                        </ul>
                    </Col>
                    <Col lg={6} md={12} className="pl-0">
                        <iframe id="live-chat" src={this.props.url}
                                width={this.props.width}
                                height={this.props.height}
                        title="Streamer Chat">
                        </iframe>
                    </Col>
                </Row>
            </Container>
        );

    }
}

export default Main;
