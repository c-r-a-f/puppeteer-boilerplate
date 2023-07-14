const fs = require('fs-extra')
const axios = require('axios')
const puppeteer = require('puppeteer')
//const FormData = require('form-data')

const TIMEOUT = 60000
const OPTIONS_WAIT_FOR_ELEMENT = {timeout: TIMEOUT, visible: true}
const BASE_URL = 'https://dev.to'

const puppeteerOptions = {
  args: ['--lang=ja,en-US,en', '--no-sandbox', '--disable-setuid-sandbox'],
  headless: false,
  //userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
}

const log = (value) => console.log(value)

class Crawler {
  constructor() {
    this.browser = ''
    this.page = ''
    this.items = []
    this.init()
  }

  async init() {
    await this.initializeBrowser()
    await this.getItems()
    //await this.browser.close()
  }

  async initializeBrowser() {
    this.browser = await puppeteer.launch(puppeteerOptions)
    this.page = await this.browser.newPage()
    await this.page.setViewport({ width: 1280, height: 800 })
    await this.page.setDefaultNavigationTimeout(0)
    log('open browser')
  }

  async resetBrowser() {
    await this.browser.close()
    log('browser closed')
    this.browser = ''
    await this.initializeBrowser()
    log('browser initialized')
  }

  async movePage(url) {
    await this.page.goto(url, {waitUntil: "networkidle2"})
    log(`move to ${url}`)
  }

  async waitPageMoveEnd() {
    await this.page.waitForNavigation();
  }

  async saveImage(imageUrl) {
    const res = await axios.get(`${BASE_URL}/${imageUrl}`, {responseType: 'arraybuffer'});
    const fileName = `./tmp/${fileName}.jpg`

    await fs.outputFileSync(fileName, new Buffer.from(res.data), 'binary')
    return fileName
  }

  async getTextContent(element) {
    return (await (await element.getProperty('textContent')).jsonValue()).trim()
  }

  async getHtmlContent(element) {
    return (await (await element.getProperty('innerHTML')).jsonValue()).trim()
  }

  async getHref(element) {
    return await element.$eval('a', a => a.getAttribute('href'))
  }

  async getItems() {
    await this.movePage(`${BASE_URL}`)

    const newsItems = await this.page.$$('.crayons-story__title')

    log(`get newsItems ${newsItems.length}`)

    for await (let newsItem of newsItems) {
      const title = await this.getTextContent(await newsItem.$('a'))
      const href = await this.getHref(newsItem)

      log(title)
      log(`${BASE_URL}/${href}`)
      //const imgUrl = await newsItem.$eval('.c-img img', img => img.getAttribute('src'))
      //await this.saveImage(imgUrl, title_hash)
    }
  }

}

new Crawler()
