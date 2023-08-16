const getYouTubeID = require('get-youtube-id');
const cheerio = require('cheerio');
const axios = require('axios');

const endpoint = 'https://clipzag.com/watch?v='

export async function youtubedl(url) {
    try {
        var id = await getYouTubeID(url);
        if (id === null) {
            return {
                status: false,
                message: 'invalid url'
            }
        }

        const { data } = await axios.get(`${endpoint}${id}`)
        const $ = cheerio.load(data)
        const ytdl = [
            {
              video: {
                resolution: $('div.downloadbox > div.btn-group.btn-group-justified > a:first').text().trim() || null,
                download: $('div.downloadbox > div.btn-group.btn-group-justified > a:first').attr('href') || null
              },
              video: {
                resolution: $('div.downloadbox > div.btn-group.btn-group-justified > a:last').text().trim() || null,
                download: $('div.downloadbox > div.btn-group.btn-group-justified > a:last').attr('href') || null
              },
            }
          ]

        return {
            status: true,
            data: ytdl
        }
    } catch (error) {
        return {
            status: false,
            message: error.message || 'Something went wrong'
        }
    }
}