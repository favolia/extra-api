const axios = require("axios");
const cheerio = require("cheerio");


export async function fbdl(url) {

    try {
        const {data} = await axios.post(`https://fdownload.app/api/ajaxSearch`, `p=home&q=${encodeURIComponent(url)}&lang=en`);
      const $ = cheerio.load(data.data)
    
      const href = $('div.fb-downloader > div.tab-wrap > div.tab__content > table.table > tbody > tr:first > td > a').attr('href')
      
        return {
            status: true,
            message: 'success',
            url: href
        }
        
      } catch (err) {
        return {
            status: false,
            message: 'Not Found',
            url: null
        }
      }


  }
  