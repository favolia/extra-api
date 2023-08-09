const axios = require('axios')
const cheerio = require('cheerio')

async function instagramdl(url) {
  try {
    const resp = await axios.post(
      "https://saveig.app/api/ajaxSearch",
      new URLSearchParams({ q: url, t: "media", lang: "id" }),
      {
        headers: {
          accept: "/",
          "user-agent": "PostmanRuntime/7.32.2",
        },
      }
    );
    let result = { status: true, data: [] };
    const $ = cheerio.load(resp.data.data);
    $(".download-box > li > .download-items").each(function () {
      $(this)
        .find(".photo-option > select > option")
        .each(function () {
          let resolution = $(this).text();
          let url = $(this).attr("value");
          if (/1080/gi.test(resolution)) result.data.push(url);
        });
      $(this)
        .find("div:nth-child(2)")
        .each(function () {
          let url2 = $(this).find("a").attr("href");
          if (!url2) return;
          if (!/\.webp/gi.test(url2)) {
            result.data.push(url2);
          }
        });
    });
    // console.log(result)
    return result;
  } catch {
    const result = {
      status: false,
      message: "Couldn't fetch data of url",
    };
    // console.log(result);
    return result;
  }
}

async function check(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    return contentType && contentType.startsWith('video/');
  } catch (error) {
    return false;
  }
};


export const igdl = async (url) => {
  const result = await instagramdl(url);
  const data = [];

  if (result['status']) {
    for (const item of result['data']) {
      data.push({ url: item, isVideo: await check(item) });
    }

    return { status: result['status'], data }
  } else {
    return { status: result['status'], message: result['message'] ? result['message'] : 'Error' }
  }
}



