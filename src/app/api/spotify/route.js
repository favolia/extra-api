const { getDownloadLink, getLyrics } = require("./functions");
const { NextResponse } = require("next/server");
const axios = require("axios")

const FailedStatus = {
    status: false,
    message: 'No query, lyrics or url parameter',
}

const endpoint = 'https://sa.caliph.eu.org/api'
const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

export async function GET(request) {
    const params = param => request.nextUrl.searchParams.get(param)
    const query = params('query')
    const url = params('url')
    const lyrics = params('lyrics')

    if (!query&&!url&&!lyrics) return NextResponse.json(FailedStatus, { 
        status: 400, 
        statusText: 'No query, lyrics or url parameter', 
         headers})


    if (query) {
        try {
            const { data } = await axios.get(`${endpoint}/search/tracks?q=${query}`)
            if (data < 1) return NextResponse.json({ status: false, message: 'Not found' }, { status: 404, statusText: 'Song not found',  headers }) 
            return NextResponse.json({
                status: true,
                message: 'success',
                data
            }, { status: 200,  headers })
        } catch (error) {
            return NextResponse.json({ status: false, message: error.message}, { status: 500, statusText: error.message,  headers })
        }
    } else if (url) {
        try {
            const { data } = await axios.get(`${endpoint}/info/track?url=${url}`)
            console.log(data);
            const meta = await getDownloadLink(data.id)
            if (data < 1) return NextResponse.json({ status: false, message: 'Not found' }, { status: 404, statusText: 'Track not found',  headers }) 
            return NextResponse.json({
                status: true,
                message: 'success',
                cover: meta.metadata.cover,
                download: meta.link,
                data,
            }, { status: 200, headers })
        } catch (error) {
            return NextResponse.json({ status: false, message: error.message}, { status: 500, statusText: error.message,  headers })
        }
    } else {
        try {
            const ID = lyrics.replace('https://open.spotify.com/track/', '')
            const lyric = await getLyrics(ID)
            if (lyric < 1) return NextResponse.json({ status: false, message: 'Not found' }, { status: 404, statusText: 'Lyrics not found', headers }) 
            return NextResponse.json({
                status: true,
                message: 'success',
                lyrics: lyric
            }, { status: 200, headers })
        } catch (error) {
            return NextResponse.json({ status: false, message: error.message}, { status: 500, statusText: error.message, headers })
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

