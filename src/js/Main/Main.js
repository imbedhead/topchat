import React from "react";
import Chat from "../Chat/Chat";
import Streamer from "./Streamer";
import {Col, Container, Row} from "react-bootstrap";

class Main extends React.Component {
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }


    render() {
        return (
            <Container fluid>
                <Streamer onClickHandler={this.props.streamerClickHandler} streamer={this.props.streamer}/>
                <Row>
                    <Col sm={6} xs={12} className="pr-0">
                        <small className="text-light">TOP CHAT</small>
                        <ul id="top-chat" className="list-group">
                            {this.props.msgs.map(msg => <Chat key={msg.key} time={msg.time} badgeList={msg.badgeList} msg={msg.msg} user={msg.user}/>)}

                            <li style={{ float:"left", clear: "both" }}
                                 ref={(el) => { this.messagesEnd = el; }}>
                            </li>
                        </ul>
                    </Col>
                    <Col sm={6} xs={12} className="pl-0">
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
