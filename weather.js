require('dotenv').config();
const puppeteer = require('puppeteer');
const { IncomingWebhook } = require("@slack/webhook");
const { setTimeout } = require("timers/promises");
const ImageKit = require("imagekit");
const fs = require('fs');


(async () => {
  try {
    console.log('開始', new Date())
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36');
    await setTimeout(10000)//10秒
    await page.goto('https://weathernews.jp/s/forecast/detail.fcgi?area=Osaka', { waitUntil: "networkidle2" })

    const targetElementSelector = '.table-weather01'
    await page.waitForSelector(targetElementSelector)
    await setTimeout(30000)//30秒

    const clip = await page.evaluate(s => {
      const el = document.querySelector(s)
      // エレメントの高さと位置を取得
      const { width, height, top: y, left: x } = el.getBoundingClientRect()
      return { width: 246, height, x, y }
    }, targetElementSelector)
    console.log('clip', clip)

    // スクリーンショットに位置と大きさを指定してclipする
    await page.screenshot({ clip, path: 'weather.png' })
    await setTimeout(5000)//5秒

    var imageFile = fs.readFileSync('./weather.png');
    var encoded = Buffer.from(imageFile).toString('base64');

    var imagekit = new ImageKit({
      publicKey: process.env.publicKey,
      privateKey: process.env.privateKey,
      urlEndpoint: process.env.urlEndpoint
    });

    // Using Promises
    imagekit.upload({
      file: encoded,
      fileName: "my_file_name.jpg",
    }).then(response => {
      // console.log(response);

      const webhook = new IncomingWebhook(process.env.IQRA_HOOK_URL);//iqra
      // const webhook = new IncomingWebhook(process.env.TSUE_HOOK_URL);//津江
      webhook.send({
        text: '',//必要
        username: "ウェザーニュース(大阪)", //通知のユーザー名
        icon_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Weathernews_logo.svg/2048px-Weathernews_logo.svg.png', //天気をアイコンに
        "attachments": [{
          "image_url": response.url
        }]
      });

    }).catch(error => {
      console.error('errorその１', error);
      return
    });
    console.log('完了')
    await setTimeout(20000)//20秒
    browser.close();
  } catch (error) {
    console.error('errorその２', error)
    return
  }
})();
