const puppeteer = require('/home/ubuntu/node_modules/puppeteer-core');
const nodemailer = require('/home/ubuntu/node_modules/nodemailer');

var browser

async function startReport() {
    browser = await puppeteer.launch({ headless: false, args: ['--blink-settings=imagesEnabled=false', '--disk-cache-dir=./Temp/browser-cache-disk'], executablePath: '/usr/bin/chromium-browser' })
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
