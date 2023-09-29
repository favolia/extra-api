const axios = require("axios")
const cheerio = require("cheerio")

export async function twitter(url) {
  let result = { status: false, type: null, media: [] }
  try {
    const { data } = await axios("https://savetwitter.net/api/ajaxSearch", {
      method: "POST",
      data: {
        q: url,
        lang: "en"
      },
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "PostmanRuntime/7.32.2",
      }
    })
    let $ = cheerio.load(data.data)
    if ($("div.tw-video").length === 0) {
      $("div.video-data > div > ul > li").each(function() {
        result.status = true
        result.type = "image"
        result.media.push($(this).find("div > div:nth-child(2) > a").attr("href"))
      })
    } else {
      $("div.tw-video").each(function() {
        result.status = true
        result.type = "video"
        result.media.push($(this).find(".tw-right > div > p:nth-child(1) > a").attr("href"))
      })
    }
    return result
  } catch (err) {
    result.status = false
    result.message = "Media not found!"
    result.media = null
    return result
  }
}