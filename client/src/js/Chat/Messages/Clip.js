import React from "react";

class Clip extends React.Component {
    /**
     * Extract slug from message link to append to iframe
     * @param link
     * @returns {string}
     */
    parseClipLink(link) {
        const parse = link.substr(link.indexOf(".tv/") + 4);
        return `https://clips.twitch.tv/embed?clip=${parse}&parent=www.topchattv.herokuapp.com&parent=topchattv.herokuapp.com`;
    }

    render() {
        return (
            <div key={`clip-${new Date().valueOf()}`}>
                <iframe src={this.parseClipLink(this.props.url)}
                        allowFullScreen="true"
                        title="Twitch Clip"/>
            </div>
        );
    }
}

export default Clip;
