import os
import json
import base64
import time

from urllib.request import urlopen
from urllib.request import Request
from urllib.error import URLError
from urllib.parse import urlencode
from playwright.sync_api import sync_playwright

API_KEY = 'CWVunPygFRV0Q6U5eeX1qEaT'
SECRET_KEY = 'SWSUHQlRy0smNQ6R0kpIDvwN9Cj7FVGv'
OCR_URL = "https://aip.baidubce.com/rest/2.0/ocr/v1/numbers"
TOKEN_URL = 'https://aip.baidubce.com/oauth/2.0/token'

def fetch_token():
    params = {'grant_type': 'client_credentials',
              'client_id': API_KEY,
              'client_secret': SECRET_KEY}
    post_data = urlencode(params)
    post_data = post_data.encode('utf-8')
    req = Request(TOKEN_URL, post_data)
    try:
        f = urlopen(req, timeout=5)
        result_str = f.read()
    except URLError as err:
        print(err)
    result_str = result_str.decode()
    result = json.loads(result_str)
    if ('access_token' in result.keys() and 'scope' in result.keys()):
        if not 'brain_all_scope' in result['scope'].split(' '):
            print ('please ensure has check the  ability')
            exit()
        return result['access_token']
    else:
        print ('please overwrite the correct API_KEY and SECRET_KEY')
        exit()

def request(url, data):
    req = Request(url, data.encode('utf-8'))
    try:
        f = urlopen(req)
        result_str = f.read()
        result_str = result_str.decode()
        return result_str
    except URLError as err:
        print(err)

def getcode():
    token = fetch_token()
    image_url = OCR_URL + "?access_token=" + token
    file_content = open('image.png', 'rb').read()
    result = request(image_url, urlencode({'image': base64.b64encode(file_content)}))
    result_json = json.loads(result)
    text = ""
    for words_result in result_json["words_result"]:
        text = text + words_result["words"]
    return text

def run(playwright):
    f = open('user.txt', 'r')
    usr = f.readline().rstrip('\n')
    passwd = f.readline().rstrip('\n')
    # date = f.readline().rstrip('\n')

    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()

    page = context.new_page()

    page.goto("http://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start")

    page.fill("input[name=\"username\"]", usr)
    page.fill("input[name=\"password\"]", passwd)

    element_handle = page.query_selector("//*[@id=\"fm1\"]/div[3]/img")
    element_handle.screenshot(path="image.png")
    code = getcode()
    
    page.fill("[placeholder=\"请输入验证码\"]", code)

    page.click("input:has-text(\"登录\")")
    time.sleep(1)

    with page.expect_navigation():
        page.click("text=开始上报")

    page.click("input[name=\"fieldJKMsfwlm\"]")
    # page.click(":nth-match(input[name=\"fieldYZNSFJCHS\"], 2)")
    # page.click("input[name=\"fieldYZNSFJCHS\"]")
    # page.fill("input[name=\"fieldJCSJ\"]", date)
    page.check("input[name=\"fieldCNS\"]")

    page.click("a:has-text(\"提交\")")
    time.sleep(1)

    with page.expect_navigation():
        page.click("text=确定")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
    print('打卡完成')
    os.system('pause')
