from playwright.sync_api import sync_playwright
import time


def run(playwright):
    browser = playwright.chromium.launch(headless=False)

    context = browser.new_context()

    page_cookies =  # Paste Here

    context.add_cookies(page_cookies)

    page = context.new_page()

    page.goto("http://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start")
    time.sleep(3)

    page.check("input[name=\"fieldCNS\"]")
    time.sleep(3)

    page.click("a:has-text(\"提交\")")
    time.sleep(3)

    page.click("text=确定")
    time.sleep(3)

    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
