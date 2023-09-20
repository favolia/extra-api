const { getDownloadLink, getLyrics, convertMs } = require("./functions");
const { NextResponse } = require("next/server");
const axios = require("axios")
const { search } = require('@nechlophomeriaa/spotifydl')

const FailedStatus = {
    status: false,
    message: 'No query, lyrics or url parameter',
}

const endpoint = 'https://api.arifzyn.biz.id'
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

    if (!query && !url && !lyrics) return NextResponse.json(FailedStatus, {
        status: 400,
        statusText: 'No query, lyrics or url parameter',
        headers
    })


    if (query) {
        try {
            const { items } = await search(query, '50')
            if (items < 1) return NextResponse.json({ status: false, message: 'Not found' }, { status: 404, statusText: 'Song not found', headers })
            const data = items.map((item, i) => {
                return {
                    artist: item.album.artists[0].name,
                    title: item.name,
                    id: item.id,
                    thumbnail: item.album.images,
                    duration: convertMs(item.duration_ms),
                    duration_ms: item.duration_ms,
                    preview_mp3: item.preview_url ? item.preview_url : null,
                    url: item.external_urls.spotify,
                    external_ids: item.external_ids,
                }
            })
            return NextResponse.json({
                author: 'vufi',
                status: true,
                message: 'success',
                data
            }, { status: 200, headers })
        } catch (error) {
            return NextResponse.json({ status: false, message: error.message }, { status: 500, statusText: error.message, headers })
        }
    } else if (url) {
        try {
            const ID = url.replace('https://open.spotify.com/track/', '')
            const { metadata, link } = await getDownloadLink(ID)
            // if (data < 1) return NextResponse.json({ status: false, message: 'Not found' }, { status: 404, statusText: 'Track not found', headers })
            return NextResponse.json({
                status: true,
                message: 'success',
                metadata,
                link
            }, { status: 200, headers })
        } catch (error) {
            return NextResponse.json({ status: false, message: error.message }, { status: 500, statusText: error.message, headers })
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
            return NextResponse.json({ status: false, message: error.message }, { status: 500, statusText: error.message, headers })
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

