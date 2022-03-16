const puppeteer = require('/home/ubuntu/node_modules/puppeteer-core');
const nodemailer = require('/home/ubuntu/node_modules/nodemailer');

var browser

async function startReport() {
    browser = await puppeteer.launch({ headless: false, args: ['--blink-settings=imagesEnabled=false', '--disk-cache-dir=./Temp/browser-cache-disk'], executablePath: '/usr/bin/chromium-browser' })
    const page = await browser.newPage()

    await page.goto('https://newcas.gzhu.edu.cn/cas/login?service=https%3A%2F%2Fyqtb.gzhu.edu.cn%2Finfoplus%2Flogin%3FretUrl%3Dhttps%253A%252F%252Fyqtb.gzhu.edu.cn%252Finfoplus%252Fform%252FXNYQSB%252Fstart')

    await page.waitForSelector('#un', { visible: true })
    await page.$eval('#un', el => el.value = '****')

    await page.waitForSelector('#pd', { visible: true })
    await page.$eval('#pd', el => el.value = '****')

    await page.waitForSelector('#index_login_btn', { visible: true })
    await page.click('#index_login_btn')

    await page.waitForSelector('#preview_start_button', { visible: true })
    await page.click('#preview_start_button')

    await page.waitForSelector('input[name=fieldSTQKbrstzk1]', { visible: true })
    await page.click('input[name=fieldSTQKbrstzk1]')

    await page.waitForSelector('input[name=fieldYQJLsfjcqtbl]', { visible: true })
    await page.click('input[name=fieldYQJLsfjcqtbl]')

    await page.waitForSelector('input[name=fieldJKMsfwlm]', { visible: true })
    await page.click('input[name=fieldJKMsfwlm]')

    await page.waitForSelector('input[name=fieldCXXXsftjhb]', { visible: true })
    await page.click('input[name=fieldCXXXsftjhb]')

    await page.waitForSelector('input[name=fieldJBXXdrsfwc]', { visible: true })
    await page.click('input[name=fieldJBXXdrsfwc]')

    await page.waitForSelector('input[name=fieldCNS]', { visible: true })
    await page.click('input[name=fieldCNS]')

    await page.waitForSelector('a[class=command_button_content]', { visible: true })
    await page.click('a[class=command_button_content]')

    await page.waitForSelector('button[class=\"dialog_button default fr\"]', { visible: true })
    await page.click('button[class=\"dialog_button default fr\"]')

    await page.waitForNavigation()

    await browser.close()
}

let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: '****',
        pass: '****',
    },
});

(async () => {
    var cnt = 0
    const retryTime = 5
    while (cnt < retryTime) {
        var ok = 1
        try {
            await startReport()
        }
        catch (err) {
            console.log(err)
            browser.close()
            ++cnt
            ok = 0
        }
        finally {
            if (ok || cnt >= retryTime) break
        }
    }
    if (cnt < 5) {
        await transporter.sendMail({
            from: '"自动通知" <****>',
            to: '****',
            subject: '打卡消息通知',
            text: '打卡成功',
            html: '<b>打卡成功</b>',
        })
    }
    else {
        await transporter.sendMail({
            from: '"自动通知" <****>',
            to: '****',
            subject: '打卡消息通知',
            text: '打卡失败, 请重新打卡',
            html: '<b>打卡失败, 请重新打卡</b>',
        })
    }
})()