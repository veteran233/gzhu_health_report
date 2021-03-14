from playwright.sync_api import sync_playwright
import time


def run(playwright):
    browser = playwright.chromium.launch(headless=False)

    context = browser.new_context()

    page = context.new_page()

    page.goto("http://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start")

    page.check("input[name=\"fieldCNS\"]")

    print(context.cookies("http://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start"))

    time.sleep(100)

    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
