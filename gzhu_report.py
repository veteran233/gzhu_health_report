from playwright.sync_api import sync_playwright
from win10toast import ToastNotifier


def run(playwright):
    f = open('user.txt', 'r')
    usr = f.readline().rstrip('\n')
    passwd = f.readline().rstrip('\n')
    # date = f.readline().rstrip('\n')
    browser = playwright.chromium.launch(
        args=['--blink-settings=imagesEnabled=false'], headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start")
    page.fill("[placeholder=\"请输入教工号或学号\"]", usr)
    page.fill("[placeholder=\"输入密码\"]", passwd)
    # element_handle = page.query_selector("//*[@id=\"fm1\"]/div[3]/img")
    # element_handle.screenshot(path="image.png")
    # code = getcode()
    # page.fill("[placeholder=\"请输入验证码\"]", code)
    page.click("#index_login_btn")
    with page.expect_navigation():
        page.click("text=开始上报")
    page.click("input[name=\"fieldYQJLsfjcqtblfz\"]") # 是否接触过半个月内有疫情重点地区旅居史的人员
    page.click("input[name=\"fieldJKMsfwlm\"]") # 健康码是否为绿码
    page.click("input[name=\"fieldCXXXsftjhbfz\"]") # 半个月内是否到过国内疫情重点地区
    # page.click(":nth-match(input[name=\"fieldYZNSFJCHS\"], 2)") # 一周内是否检测核酸：否
    # page.click("input[name=\"fieldYZNSFJCHS\"]") # 一周内是否检测核酸：是
    # page.fill("input[name=\"fieldJCSJ\"]", date) # 检测时间
    # page.click("imput[name=\"fieldSFJZYM\"]") # 是否接种疫苗
    # page.click(":nth-match(input[name=\"fieldJZDZC\"], 2)") # 接种的针次
    page.check("input[name=\"fieldCNS\"]")
    page.click("a:has-text(\"提交\")")
    with page.expect_navigation():
        page.click("text=确定")
    context.close()
    browser.close()


while True:
    try:
        with sync_playwright() as playwright:
            run(playwright)
    except:
        True
    else:
        break
ToastNotifier().show_toast(msg="打卡完成", duration=-1, threaded=True)
