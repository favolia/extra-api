const axios = require('axios')
const spotify = require("@ksolo/spotify-search");
const token = {
    key: "271f6e790fb943cdb34679a4adcc34cc",
    secret: "c009525564304209b7d8b705c28fd294",
}
spotify.setCredentials(token.key, token.secret);

export async function getLyrics(id) {
    try {
        const { data } = await axios.get(`https://spotify-lyric-api.herokuapp.com/?trackid=${id}&format=lrc`)
        return data.lines
    } catch (error) {
        console.log(error);
        return []
    }
}

export async function getDownloadLink(id) {
    try {
        const { data } = await axios.get(`https://api.spotifydown.com/download/${id}`, {
            headers: {
                'Origin': 'https://spotifydown.com',
                'Referer': 'https://spotifydown.com/',
            }
        })
        console.log(data);
        if (!data.success) {
            throw new Error(data.message)
        }
        return data
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
        // return { link: null, metadata: { cover: null } }
    }
}

export async function search(query) {
    try {
        const data = await spotify.search(q);
        return data.tracks.items;
    } catch (error) {
        throw new Error(error.message)
    }
}

export function convertMs(duration) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const formattedHours = (hours < 10) ? "0" + hours : hours;
    const formattedMinutes = (minutes < 10) ? "0" + minutes : minutes;
    const formattedSeconds = (seconds < 10) ? "0" + seconds : seconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
