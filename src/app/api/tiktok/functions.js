import axios from 'axios';
import cheerio from 'cheerio';

// async function tiktokdl2(url) {
//     try {
//         const getUdid = async () => {
//             const { data } = await axios.get(`https://tikdown.org`);
//             let $ = cheerio.load(data);
//             return $("meta:nth-child(2)").attr("content");
//         };
//         const { data } = await axios.get(
//             `https://tikdown.org/getAjax?url=${url}&_token=${getUdid}`
//         );
//         let $ = cheerio.load(data.html);
//         let result = { status: true, media: [] };
//         $(
//             "div.download-result > .download-links > div.button-primary-gradient"
//         ).each(function () {
//             result.media.push($(this).find("a").attr("href"));
//         });
//         console.log(result);
//         return result;
//     } catch {
//         const result = {
//             status: false,
//             message: "Couldn't fetch data of url",
//         };
//         console.log(result);
//         return result;
//     }
// }

async function tiktokdl(url) {
    try {
        const { data } = await axios(`https://downloader.bot/api/tiktok/info`, {
            method: "post",
            data: { url: url },
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
        return data
    } catch (err) {
        const result = {
            status: false,
            message: "Video not found",
            messageCmd: String(err)
        }
        console.log(result)
        return result
    }
}

export { tiktokdl }
