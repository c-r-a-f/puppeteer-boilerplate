//const fs = require('fs-extra')
//const axios = require('axios')
const puppeteer = require('puppeteer')

const TIMEOUT = 60000
const OPTIONS_WAIT_FOR_ELEMENT = {timeout: TIMEOUT, visible: true}
const BASE_URL = 'https://yahoo.co.jp'

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
    this.init()
  }

  async initializeBrowser() {
    this.browser = await puppeteer.launch(puppeteerOptions)
    this.page = await this.browser.newPage()
    await this.page.setViewport({ width: 1280, height: 800 })
    await this.movePage(BASE_URL)
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
  }

  async waitPageMoveEnd() {
    await this.page.waitForNavigation();
  }

  async init() {
    await this.initializeBrowser()
  }
}

new Crawler()
