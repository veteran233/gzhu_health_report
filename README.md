# gzhu_health_report
广州大学健康打卡脚本

**注意：本脚本只能用于日常正常的健康打卡，如果出现发病症状，请如实填写！**

需要某些第三方库，安装方式：
```
pip install playwright
python -m playwright install
```

使用方法：

一、注册百度的OCR（免费白嫖的），具体方法百度，链接：https://ai.baidu.com/tech/ocr_others/numbers

二、复制API_KEY和SECRET_KEY到gzhu_report.py中

三、在与gzhu_report.py同目录中新建文件user.txt，第一行输入账户，第二行输入密码，第三行输入核酸检测时间，格式为xxxx-xx-xx，例如2021-06-05

四、运行
