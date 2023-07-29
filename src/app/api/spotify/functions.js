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
        return data
    } catch (error) {
        console.log(error);
        return {link: null, metadata: {cover: null}}
    }
}