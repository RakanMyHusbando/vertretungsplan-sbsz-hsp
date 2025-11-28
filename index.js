const puppeteer = require("puppeteer")
const fs = require("node:fs")

let page

const init = async () => {
    const browser = await puppeteer.launch()
    page = await browser.newPage()
    
    await login()
    await refresh()
    await screenshot()

    await browser.close()
}

const login = async () => {
    const sbszHspClass = process.env.SBSZ_HSP_CLASS

    await page.goto("https://sbsz-hsp.com/davinci-timetable.html?account=private")

    await page.locator("input#davinci-login-username").fill(sbszHspClass)
    await page.locator("input#davinci-login-password").fill(sbszHspClass)
    await page.locator("input#davinci-login-btn").click()
}

const refresh = async () => 
    await page.locator("button.pull-right.refresh-icon").click()

const screenshot = async () => {
    const screenshotPath = process.env.SCREENSHOT_PATH
    
    if (!process.env.HOME)
        throw new Error("HOME env variable not set")

    const fileElement = await page.waitForSelector("div#davinci-scheduler")

    if (fs.existsSync(screenshotPath))
        fs.rmSync(screenshotPath)

    await fileElement.screenshot({ path: screenshotPath })
}

init()