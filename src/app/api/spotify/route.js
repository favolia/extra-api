const { NextResponse, NextRequest } = require("next/server");
const axios = require("axios")

const FailedStatus = {
    status: false,
    message: 'No query or url parameter',
}

const endpoint = 'https://sa.caliph.eu.org/api'

export async function GET(request) {
    const params = param => request.nextUrl.searchParams.get(param)
    const query = params('query')
    const url = params('url')

    if (!query&&!url) return NextResponse.json(FailedStatus, {status: 400, statusText: 'No query or url parameter'})

    async function getLyrics(id) {
        try {
            const { data } = await axios.get(`https://spotify-lyric-api.herokuapp.com/?trackid=${id}&format=lrc`)
            return data.lines
        } catch (error) {
            console.log(error);
            return []
        }
    }
    
    async function getDownloadLink(id) {
        try {
            const { data } = await axios.get(`https://api.spotifydown.com/download/${id}`, {
                headers: {
                    'Origin': 'https://spotifydown.com',
                    'Referer': 'https://spotifydown.com/',
                  }
            })
            return data
        } catch (error) {
            console.log(error);
            return {link: null, metadata: {cover: null}}
        }
    }

    if (query) {
        try {
            const { data } = await axios.get(`${endpoint}/search/tracks?q=${query}`)
            if (data < 1) return NextResponse.json({ status: false, message: 'Not found' }, { status: 404, statusText: 'Song not found' }) 
            return NextResponse.json({
                status: true,
                message: 'success',
                data
            }, { status: 200 })
        } catch (error) {
            return NextResponse.json({ status: false, message: error.message}, { status: 500, statusText: error.message })
        }
    } else {
        try {
            const { data } = await axios.get(`${endpoint}/info/track?url=${url}`)
            const lyrics = await getLyrics(data.id)
            const meta = await getDownloadLink(data.id)
            if (data < 1) return NextResponse.json({ status: false, message: 'Not found' }, { status: 404, statusText: 'Track not found' }) 
            return NextResponse.json({
                status: true,
                message: 'success',
                cover: meta.metadata.cover,
                download: meta.link,
                data,
                lyrics,
            }, { status: 200})
        } catch (error) {
            return NextResponse.json({ status: false, message: error.message}, { status: 500, statusText: error.message })
        }
    }
  }


// QUERY
//          /api/query?={song name}                         
//          RESPONSE ✔ 200:                          Response ❌ 404:
//          ----------------------------------------------------------
//          status: Boolean                          status: Boolean
//          message: String                          message: String
//          data: <Array>: [<Object>: {
//              title: String 
//              artist: String 
//              album: String
//              url: Url
//              id: String
//              release_date: String
//              duration: String
//              durationMs: Number
//              thumbnail: Url
//              preview_mp3: Url
//          }]


// URL
//          /api/url?={track URL}                         
//          RESPONSE ✔ 200:                          Response ❌ 404:                 Response ❌ 500:
//          --------------------------------------------------------------------------------------------
//          status: Boolean                          status: Boolean                   status: Boolean
//          message: String                          message: String                   mesage: String
//          cover: Url
//          download: Url
//          data: <Array>: [<Object>: {
//              title: String
//              artist: String
//              album: String
//              url: Url
//              id: String
//              release_date: String
//              duration: String
//              durationMs: Number
//              thumbnail: Url
//              preview_mp3: Url
//          }]
//          lyrics: <Array> [<Object> {
//              timeTag: String
//              words: String
//          }]

