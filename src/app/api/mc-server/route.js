const { javaServers } = require("./functions");
const { NextResponse } = require("next/server");

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const errorMessage = {
    status: false,
    message: 'No ip parameter'
}

export async function GET(request) {
    const params = param => request.nextUrl.searchParams.get(param)
    const ip = params('ip')
    if (!ip) return NextResponse.json(errorMessage, { 
        status: 400, 
        statusText: 'No ip parameter', 
        headers: headers})

    try {
        const result = await javaServers(ip)
        if (result.status) {
            return NextResponse.json(result, {status: 200, statusText: 'OK', headers})
        } else {
            return NextResponse.json(result, { status: 404, statusText: result.message, headers })
        }
    } catch (error) {
        return NextResponse.json({
            status: false,
            error: error.message
        }, {status: 500, statusText: 'internal server error', headers})
    }

}

