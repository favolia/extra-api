const axios = require('axios')

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

export function convertMs(duration) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const formattedHours = (hours < 10) ? "0" + hours : hours;
    const formattedMinutes = (minutes < 10) ? "0" + minutes : minutes;
    const formattedSeconds = (seconds < 10) ? "0" + seconds : seconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
