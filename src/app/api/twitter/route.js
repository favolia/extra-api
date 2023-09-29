import { twitter } from "./functions";
const { NextResponse } = require("next/server");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const errorMessage = {
  status: false,
  message: "No url parameter",
};

export async function GET(request) {
  const params = (param) => request.nextUrl.searchParams.get(param);
  const url = params("url");
  if (!url)
    return NextResponse.json(errorMessage, {
      status: 400,
      statusText: "No query/url parameter",
      headers,
    });
  try {
    const result = await twitter(url);
    if (result.status) {
      return NextResponse.json(result, {
        status: 200,
        statusText: "OK",
        headers,
      });
    } else {
      return NextResponse.json(result, {
        status: 404,
        statusText: result.message,
        headers,
      });
    }
  } catch (err) {
    return NextResponse.json(
      {
        status: false,
        message: String(err),
      },
      {
        status: 500,
        statusText: "Internal Server Error",
        headers,
      }
    );
  }
}
