const puppeteer = require('puppeteer');

async function startReport() {
    const browser = await puppeteer.launch({ headless: false, args: ['--blink-settings=imagesEnabled=false', '--disk-cache-dir=./Temp/browser-cache-disk'] })
    const page = await browser.newPage()

    await page.goto('https://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start')

    await page.waitForSelector('#un', { visible: true })
    await page.$eval('#un', el => el.value = '账号，字符串类型').then(() => { }, () => { browser.close(); throw new Error('err') })

    await page.waitForSelector('#pd', { visible: true })
    await page.$eval('#pd', el => el.value = '密码，字符串类型').then(() => { }, () => { browser.close(); throw new Error('err') })

    await page.waitForSelector('#index_login_btn', { visible: true })
    await page.click('#index_login_btn').then(() => { }, () => { browser.close(); throw new Error('err') })

    await page.waitForSelector('#preview_start_button', { visible: true })
    await page.click('#preview_start_button').then(() => { }, () => { browser.close(); throw new Error('err') })

    await page.waitForSelector('input[name=fieldYQJLsfjcqtbl]', { visible: true })
    await page.click('input[name=fieldYQJLsfjcqtbl]').then(() => { }, () => { browser.close(); throw new Error('err') }) // 是否接触过半个月内有疫情重点地区旅居史的人员

    await page.waitForSelector('input[name=fieldJKMsfwlm]', { visible: true })
    await page.click('input[name=fieldJKMsfwlm]').then(() => { }, () => { browser.close(); throw new Error('err') }) // 健康码是否为绿码

    await page.waitForSelector('input[name=fieldCXXXsftjhb]', { visible: true })
    await page.click('input[name=fieldCXXXsftjhb]').then(() => { }, () => { browser.close(); throw new Error('err') }) // 半个月内是否到过国内疫情重点地区

    await page.waitForSelector('input[name=fieldJBXXdrsfwc]', { visible: true })
    await page.click('input[name=fieldJBXXdrsfwc]').then(() => { }, () => { browser.close(); throw new Error('err') }) // 当日是否外出

    await page.waitForSelector('input[name=fieldCNS]', { visible: true })
    await page.click('input[name=fieldCNS]').then(() => { }, () => { browser.close(); throw new Error('err') })

    await page.waitForSelector('a[class=command_button_content]', { visible: true })
    await page.click('a[class=command_button_content]').then(() => { }, () => { browser.close(); throw new Error('err') })

    await page.waitForSelector('button[class=\"dialog_button default fr\"]', { visible: true })
    await page.click('button[class=\"dialog_button default fr\"]').then(() => { }, () => { browser.close(); throw new Error('err') })

    await page.waitForNavigation()

    await browser.close()
}

(async () => {
    var cnt = 0
    var ok = 1
    while (cnt < 5) {
        try {
            await startReport()
        }
        catch (err) {
            ++cnt
            ok = 0
        }
        finally {
            if (ok || cnt >= 5) break
        }
    }
    if (cnt < 5) console.log('打卡成功')
    else console.log('打卡失败')
})()
