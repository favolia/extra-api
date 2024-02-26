const getYouTubeID = require('get-youtube-id');
const cheerio = require('cheerio');
const axios = require('axios');

const endpoint = 'https://clipzag.com/watch?v='

const getHeader = async ({ url }) => {
    const countsize = await axios.head(url);
    const size = await countsize.headers['content-length'];
    return size;
};

const originalUrl = async (u) => await fetch(u, {
    headers: {
        accept: "*/*",
        "user-agent": "PostmanRuntime/7.32.2",
        "content-type": "application/x-www-form-urlencoded"
    },
}).then(res => res.url).catch(err => u);

const sizeToMB = (size, unit) => {
    const sizeInBytes = {
        'B': size,
        'KB': size * 1024,
        'MB': size * 1024 * 1024,
        'GB': size * 1024 * 1024 * 1024,
        'TB': size * 1024 * 1024 * 1024 * 1024,
        'PB': size * 1024 * 1024 * 1024 * 1024 * 1024,
    };

    return sizeInBytes[unit] / (1024 * 1024);
};

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

        const downloadsDetail = [
            {
                resolution: $('div.downloadbox > div.btn-group.btn-group-justified > a:first').text().trim() || '',
                download: $('div.downloadbox > div.btn-group.btn-group-justified > a:first').attr('href') || null,
            },
            {
                resolution: $('div.downloadbox > div.btn-group.btn-group-justified > a:last').text().trim() || '',
                download: $('div.downloadbox > div.btn-group.btn-group-justified > a:last').attr('href') || null
            }
        ]

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
                videos: await Promise.all(downloadsDetail.map(async (item) => {
                    const oriUrl = await originalUrl(item.download);
                    const sizeInBytes = await getHeader({ url: oriUrl });
                    const sizeInMB = sizeToMB(sizeInBytes, 'B');
                    return {
                        resolution: item.resolution,
                        download: oriUrl,
                        size: sizeInMB,
                    };
                }))
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