const express = require("express");
const axios = require("axios");
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
const cors = require("cors")
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const EMOTES = {};
const ELAPSED_CACHE = 1000 * 60 * 15;
let helix = null;
let AUTH = {};
let AUTH_EXPIRED = true;

function isExpired(emoteSet) {
    return new Date().valueOf() - emoteSet.lastRetrieved >= ELAPSED_CACHE;
}

async function getAuthToken() {
    const getNewToken = async () => {
        await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${process.env.REACT_APP_TWITCH_CLIENT_SECRET}&grant_type=client_credentials`)
            .then(response => {
                AUTH = response.data;
                AUTH_EXPIRED = new Date(new Date().valueOf() + AUTH.expires_in);
            });
    }
    await getNewToken();
    helix = axios.create({
        baseURL: 'https://api.twitch.tv/helix/',
        headers: {'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_ID, 'Authorization': `Bearer ${AUTH.access_token}`}
    });
}

getAuthToken();

app.get("/api/emotes/:streamer", async (req, res) => {
    // Convert entered streamer name to lower case to prevent duplicate storages in cache
    const streamer = req.params.streamer.toLowerCase();
    let emoteSet = EMOTES[streamer];
    // Check if we have cached the current streamers emotes already and that they are within the last 15 minutes
    if (emoteSet && !isExpired(emoteSet)) {
        return EMOTES[streamer].allEmotes;
    }
    // Call the external API to retrieve all emotes
    const emotes = await axios.get(`https://emotes.adamcy.pl/v1/channel/${streamer}/emotes/all`, response => {
        response.json();
    }).catch(error => {
        return {error: "Not Found"};
    });

    // If an error occurred on fetch, return an error object (emotes will be posted in plaintext)
    if (emotes.error) {
        return {error: "Not Found"};
    }
    // Parse response into structure we use
    let massagedEmote = {};
    emotes.data.forEach(emote => massagedEmote[emote.code] = emote.urls.map(link => `${link.url} ${link.size}`));
    EMOTES[streamer] = {
        lastRetrieved: new Date().valueOf(),
        allEmotes: massagedEmote
    };

    res.send(EMOTES[streamer].allEmotes);
});

/**
 * Get requested streamer data (display name & avatar)
 */
app.get("/api/streamers/:streamer", async (req, res) => {
    // Convert entered streamer name to lower case to prevent duplicate storages in cache
    const streamer = req.params.streamer.toLowerCase();
    if (AUTH_EXPIRED <= new Date()) {
        await getAuthToken();
    }

    // Call the external API to retrieve all emotes
    const response = await helix.get(`users?login=${streamer}`, r => r.json()).catch(error => {
        return {error: "Not Found"}
    });

    let data = {};
    if (!response.error) {
        const responseData = response.data.data;
        try {
            data = {
                displayName: responseData[0].display_name,
                avatar: responseData[0].profile_image_url
            }
        } catch {
            data = {
                displayName: "No User Found",
                invalid: true,
                avatar: null
            }
        }
    }

    res.send(data);
});

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    app.use(express.static('client/build'));

    // Express serve up index.html file if it doesn't recognize route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})

module.exports = app;
