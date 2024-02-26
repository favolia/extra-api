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

        return {
            status: true,
            message: 'success',
            data: {
                title: $('div.border-bg > div.video-title').text().trim() || '',
                channel_profile: $('div.channelDetails.col-sm-8 > a > img.channelThumb').attr('src'),
                channel_name: $('div.channelDetails.col-sm-8 > a.uploader-name').text() || '',
                channel_subscription: $('div.channelDetails.col-sm-8 > div > span.subscripberNum').text(),
                views: $('div.text-right.col-sm-4 > div:nth-child(1)').text().trim(),
                likes: $('div.text-right.col-sm-4 > div.font-size-13 > span#likeButton').text().trim() || '0',
                release: $('div.tab-pane.fade.active.in > h4.font-weight-bold').text().trim().replace('Video Link', ''), 
                description: $('div.tab-pane.fade.active.in > div.overflow-hidden').text().trim() || '', 
                videos: [
                    {
                        resolution: $('div.downloadbox > div.btn-group.btn-group-justified > a:first').text().trim() || '',
                        download: $('div.downloadbox > div.btn-group.btn-group-justified > a:first').attr('href') || null,
                    },
                    {
                        resolution: $('div.downloadbox > div.btn-group.btn-group-justified > a:last').text().trim() || '',
                        download: $('div.downloadbox > div.btn-group.btn-group-justified > a:last').attr('href') || null
                    }
                ]
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message || 'Something went wrong',
            data: null
        }
    }
}