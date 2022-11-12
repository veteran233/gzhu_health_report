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

    var str_selectbutton;

    str_selectbutton = 'html > body > div:nth-child(4) > form > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(10) > td:nth-child(1) > div > div > span > span:nth-child(1) > span > span:nth-child(2)'
    await page.waitForSelector(str_selectbutton, { visible: true })
    await page.click(str_selectbutton)
    await page.waitForSelector('input[class=select2-search__field]', { visible: true })
    await page.type('input[class=select2-search__field]', '广东省')
    await page.waitForTimeout(3000)
    await page.waitForSelector('#select2-V1_CTRL119-results > li', { visible: true })
    await page.click('#select2-V1_CTRL119-results > li')

    str_selectbutton = 'html > body > div:nth-child(4) > form > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(10) > td:nth-child(2) > div > div > span > span:nth-child(1) > span > span:nth-child(2)'
    await page.waitForSelector(str_selectbutton, { visible: true })
    await page.click(str_selectbutton)
    await page.waitForSelector('input[class=select2-search__field]', { visible: true })
    await page.type('input[class=select2-search__field]', '广州市')
    await page.waitForTimeout(3000)
    await page.waitForSelector('#select2-V1_CTRL120-results > li', { visible: true })
    await page.click('#select2-V1_CTRL120-results > li')

    str_selectbutton = 'html > body > div:nth-child(4) > form > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(10) > td:nth-child(3) > div > div > span > span:nth-child(1) > span > span:nth-child(2)'
    await page.waitForSelector(str_selectbutton, { visible: true })
    await page.click(str_selectbutton)
    await page.waitForSelector('input[class=select2-search__field]', { visible: true })
    await page.type('input[class=select2-search__field]', '番禺区')
    await page.waitForTimeout(3000)
    await page.waitForSelector('#select2-V1_CTRL121-results > li', { visible: true })
    await page.click('#select2-V1_CTRL121-results > li')

    await page.waitForSelector('input[name=fieldJBXXjgsjtdz]', { visible: true })
    await page.$eval('input[name=fieldJBXXjgsjtdz]', el => el.value = '广州大学城外环西路230号广州大学')

    // await page.waitForSelector('input[name=fieldSTQKbrstzk1]', { visible: true })
    // await page.click('input[name=fieldSTQKbrstzk1]') // 本人身体状况

    await page.waitForSelector('input[name=fieldYQJLsfjcqtbl]', { visible: true })
    await page.click('input[name=fieldYQJLsfjcqtbl]') // 是否接触过半个月内有疫情重点地区旅居史的人员

    await page.waitForSelector('input[name=fieldJKMsfwlm]', { visible: true })
    await page.click('input[name=fieldJKMsfwlm]') // 健康码是否为绿码

    await page.waitForSelector('input[name=fieldCXXXsftjhb]', { visible: true })
    await page.click('input[name=fieldCXXXsftjhb]') // 半个月内是否到过国内疫情重点地区

    await page.waitForSelector('input[name=fieldJBXXdrsfwc]', { visible: true })
    await page.click('input[name=fieldJBXXdrsfwc]') // 当日是否外出

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