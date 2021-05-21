import tesserocr
import time
from PIL import Image
from playwright.sync_api import sync_playwright
def getcode(path):
    image = Image.open(path)
    result = tesserocr.image_to_text(image)
    return result

usr = # Your Username
passwd = # Your Password

def run(playwright):
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()

    page = context.new_page()

    page.goto("http://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start")

    page.fill("input[name=\"username\"]", str(usr))
    page.fill("input[name=\"password\"]", str(passwd))

    element_handle = page.query_selector("//*[@id=\"fm1\"]/div[3]/img")
    element_handle.screenshot(path="image.png")
    code = getcode("image.png")

    page.fill("[placeholder=\"请输入验证码\"]", code)

    page.click("text=登录")
    time.sleep(1)

    with page.expect_navigation():
        page.click("text=开始上报")

    page.check("input[name=\"fieldCNS\"]")

    page.click("a:has-text(\"提交\")")
    time.sleep(1)

    with page.expect_navigation():
        page.click("text=确定")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
