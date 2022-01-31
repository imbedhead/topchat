import React from "react";
import Link from "./Link";

class Text extends React.Component {
    /**
     * Check if given text is a link
     * @param msg
     * @returns {boolean}
     */
    isLink(msg) {
        return msg.indexOf("https://") === 0 || msg.indexOf("http://") === 0;
    }


    render() {
        return (
            <span>
                {this.isLink(this.props.msg) ? <Link url={this.props.msg}/> : (this.props.msg + " ")}
            </span>
        );
    }
}

export default Text;
