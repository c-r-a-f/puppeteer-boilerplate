//const fs = require('fs-extra')
//const axios = require('axios')
const puppeteer = require('puppeteer')

const TIMEOUT = 60000
const OPTIONS_WAIT_FOR_ELEMENT = {timeout: TIMEOUT, visible: true}
const log = (value) => console.log(value)

class Crawler {

  constructor() {
    this.init()
  }

  async initializeBrowser() {
    this.browser = await puppeteer.launch({
      args: ['--lang=ja,en-US,en', '--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
    })
  }
  async resetBrowser() {
    await this.browser.close()
    log('browser closed')
    this.browser = ''
    log('browser initialized')
  }

  async waitPageMoveEnd() {
    await this.page.waitForNavigation();
  }

  async init() {
    this.initializeBrowser()
  }

}

new Crawler()
