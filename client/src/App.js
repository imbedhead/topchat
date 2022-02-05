import ComfyJS from "comfy.js";
import './App.scss';
import Main from "./js/Main/Main";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import GLOBAL_EMOTES from "./GLOBAL_EMOTES.json"

let currentEmotes = {};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {topChats: [], url: "", width: 0, height: 0, streamer: "No Active Stream"};
        ComfyJS.onChat = (user, message, flags, self, extra) => this.appendMessage(user, message, flags, extra);
        this.currentStreamer = "";
        window.addEventListener('resize', this.resizeHandler.bind(this));
    }

    componentDidMount() {
        this.resizeHandler();
    }

    /**
     * Gets padding for header section
     */
    getPadding(top, bottom) {
        const parsedTop = Number(top.replace("px", ""));
        const parsedBottom = Number(bottom.replace("px", ""));
        return parsedTop + parsedBottom;
    }

    /**
     * Resizes iframe and top chat when viewport changes
     */
    resizeHandler() {
        const height = document.documentElement.clientHeight;
        const width = document.documentElement.clientWidth;
        const header = document.getElementById("header");
        const iframe = {height: height - header.offsetHeight, width: width / 2 - 20}
        if (width < 992) {
            iframe.width = width - 20;
            iframe.height = 500;
        }
        this.setState(iframe);
    }

    /**
     * Joins given streamer's chat
     * @param streamer string value of streamer
     */
    joinStream(streamer) {
        // Only attempt to connect if given a new streamer
        if (streamer !== this.currentStreamer) {
            // Disconnect from the previous chat if we have a connection already
            if (this.currentStreamer) {
                ComfyJS.Disconnect();
            }
            this.currentStreamer = streamer;
            this.setState({streamer: this.currentStreamer, topChats: []});
            ComfyJS.Init(streamer);
            this.updateUrl(streamer)
            this.getEmotes().then(r => r.json().then(emotes => currentEmotes = emotes));
        }
    }

    /**
     * Retrieve the channel emotes for chat (Twitch, BTTV, 7TTV, FFZ)
     */
    async getEmotes() {
        const streamer = this.currentStreamer;
        return fetch(`/api/emotes/${streamer}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    /**
     * Event Handler for Enter Chat button click
     * @param streamer string value of streamer
     */
    streamerClickHandler(streamer) {
        // Break out if input is empty
        if (!streamer) {
            return;
        }
        this.joinStream(streamer);
    }

    /**
     * Updates iframe's src url to connect to chat
     * @param streamer string value of streamer to join
     */
    updateUrl(streamer) {
        this.setState({url: `https://www.twitch.tv/embed/${streamer}/chat?parent=www.topchattv.herokuapp.com&parent=topchattv.herokuapp.com&darkpopout`});
    }

    /**
     * Get emote from string name
     * @param name string value of emote
     * @returns {boolean|*} false if not found, emote object otherwise
     */
    getEmote(name) {
        // Check if given emote string is a global emote
        if (GLOBAL_EMOTES[name]) {
            return GLOBAL_EMOTES[name];
        }
        // Check if given emote string is a channel-specific emote instead
        if (currentEmotes[name]) {
            return currentEmotes[name];
        }
        // Current string is not an emote
        return false;
    }

    /**
     * Parse through chatter's message to look for potential emotes in any
     * @param msg chatter's message string
     * @returns {*} array of plaintext and emote objects found in message
     */
    parseForEmotes(msg) {
        // Iterate through each word, returning an emote object if an emote if found, otherwise return the plaintext word
        return msg.split(" ").map(str => {
            const emote = this.getEmote(str)
            // If current word is an emote, convert it to an object
            if (emote) {
                return {name: str, urls: emote.join(",")};
            }
            // Current word is plaintext, return it as-is
            return str;
        });
    }

    /**
     * Check if the given user has non-english characters and display both names if found
     * @param extra Comfy.js object of extra flags for message
     * @returns {string|*} display name string
     */
    getUsername(extra) {
        if (extra.displayName.toLowerCase() === extra.username.toLowerCase()) {
            return extra.displayName;
        }
        return `${extra.displayName} (${extra.username})`;
    }

    /**
     * Check if user color is "dark", setting it to a light color instead if it is
     * @param color rbg color string
     * @returns {string|*}
     */
    getColor(color) {
        const [r,g,b] = color.replace(/[rbg]|[()]/gi,"").split(", ");
        const hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
        );
        if (hsp<127.5) {

            return "rgb(242, 240, 237)";
        }
        else {

            return color;
        }
    }

    /**
     * Adds new message to TopChat if message if from elevated user
     * @param user
     * @param message
     * @param flags
     * @param extra
     */
    appendMessage(user, message, flags, extra) {
        const badges = [];
        let isElevatedUser = false;
        let userMessage = message;
        if ((extra.userBadges && extra.userBadges.staff)) {
            badges.push({key: "staff" + new Date().valueOf(), type: "staff", name: "Staff"});
            isElevatedUser = true;
        }
        if (flags.broadcaster) {
            badges.push({key: "broadcaster" + new Date().valueOf(), type: "broadcaster", name: "Broadcaster"});
            isElevatedUser = true;
        }
        if (flags.mod) {
            badges.push({key: "mod" + new Date().valueOf(), type: "mod", name: "Moderator"});
            isElevatedUser = true;
        }
        if (flags.vip) {
            badges.push({key: "vip" + new Date().valueOf(), type: "vip", name: "VIP"});
            isElevatedUser = true;
        }
        if ((extra.userBadges && extra.userBadges.partner)) {
            badges.push({key: "partner" + new Date().valueOf(), type: "partner", name: "Partner"});
            isElevatedUser = true;
        }
        if (!isElevatedUser) {
            return;
        }
        const msg = `: ${userMessage}`;
        const allChat = this.state.topChats;
        const newEntry = {
            key: user + new Date().valueOf(),
            badgeList: badges,
            msg: this.parseForEmotes(msg),
            userCardUrl: `https://www.twitch.tv/popout/${this.currentStreamer}/viewercard/${user}`,
            time: new Date(Number(extra.timestamp)).toTimeString().substr(0, 8),
            user: {username: this.getUsername(extra), style: {color: this.getColor(extra.userColor)}}
        };
        if (allChat.length > 100) {
            allChat.shift();
        }
        this.setState({topChats: [...allChat, newEntry]});
    }

    render() {
        return (
            <div className="App bg-dark text-light">
                <Main msgs={this.state.topChats} url={this.state.url} height={this.state.height}
                      width={this.state.width}
                      streamerClickHandler={this.streamerClickHandler.bind(this)} streamer={this.state.streamer}/>
            </div>
        );
    }
}

export default App;
