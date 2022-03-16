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
    page.goto("https://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start")
    page.fill("[placeholder=\"请输入教工号或学号\"]", usr)
    page.fill("[placeholder=\"输入密码\"]", passwd)
    # element_handle = page.query_selector("//*[@id=\"fm1\"]/div[3]/img")
    # element_handle.screenshot(path="image.png")
    # code = getcode()
    # page.fill("[placeholder=\"请输入验证码\"]", code)
    page.click("#index_login_btn")
    with page.expect_navigation():
        page.click("text=开始上报")
    page.click("input[name=\"fieldSTQKbrstzk1\"]")  # 本人身体状况
    page.click("input[name=\"fieldYQJLsfjcqtbl\"]")  # 是否接触过半个月内有疫情重点地区旅居史的人员
    page.click("input[name=\"fieldJKMsfwlm\"]")  # 健康码是否为绿码
    page.click("input[name=\"fieldCXXXsftjhb\"]")  # 半个月内是否到过国内疫情重点地区
    page.click("input[name=\"fieldJBXXdrsfwc\"]") # 当日是否外出
    page.check("input[name=\"fieldCNS\"]")
    page.click("a:has-text(\"提交\")")
    with page.expect_navigation():
        page.click("text=确定")
    context.close()
    browser.close()


cnt = 0
while cnt < 30:
    try:
        with sync_playwright() as playwright:
            run(playwright)
    except:
        cnt += 1
    else:
        break
if cnt < 30:
    ToastNotifier().show_toast(msg="打卡完成", duration=-1, threaded=True)
else:
    ToastNotifier().show_toast(msg="注意！打卡未成功！", duration=-1, threaded=True)
