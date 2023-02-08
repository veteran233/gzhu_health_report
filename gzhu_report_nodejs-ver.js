const puppeteer = require('puppeteer');

var browser
async function startReport() {
    browser = await puppeteer.launch({ headless: false, args: ['--blink-settings=imagesEnabled=false', '--disk-cache-dir=./Temp/browser-cache-disk'] })
    const page = await browser.newPage()

    await page.goto('https://yq.gzhu.edu.cn/infoplus/form/XSJKZKSB/start')

    await page.waitForSelector('#un', { visible: true })
    await page.$eval('#un', el => el.value = '账号')

    await page.waitForSelector('#pd', { visible: true })
    await page.$eval('#pd', el => el.value = '密码')

    await page.waitForSelector('#index_login_btn', { visible: true })
    await page.click('#index_login_btn')

    await page.waitForSelector('input[name=fieldCN]', { visible: true })
    await page.click('input[name=fieldCN]')

    await page.waitForSelector('a[class=command_button_content]', { visible: true })
    await page.click('a[class=command_button_content]')

    await page.waitForSelector('button[class=\"dialog_button default fr\"]', { visible: true })
    await page.click('button[class=\"dialog_button default fr\"]')

    await page.waitForNavigation()

    await browser.close()
}

(async () => {
    var cnt = 0
    const retryTime = 5
    while (cnt < retryTime) {
        var ok = 1
        try {
            await startReport()
        }
        catch (err) {
            browser.close()
            ++cnt
            ok = 0
        }
        finally {
            if (ok || cnt >= retryTime) break
        }
    }
    if (cnt < 5) console.log('打卡成功')
    else console.log('打卡失败')
})()
