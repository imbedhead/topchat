const express = require("express");
const axios = require("axios");

const PORT = process.env.PORT || 3001;

const app = express();

const EMOTES = {};
const ELAPSED_CACHE = 1000 * 60 * 15;

function isExpired(emoteSet) {
    return new Date().valueOf() - emoteSet.lastRetrieved >= ELAPSED_CACHE;
}

app.get("/emotes/:streamer", async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})