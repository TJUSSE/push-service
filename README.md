push-service
============

[![Dependency Status](https://www.versioneye.com/user/projects/56066b555a262f001a000077/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56066b555a262f001a000077)

SSE 通知推送服务，定时取出需要推送的通知，依次加入发送队列（邮件发送由 [mailer](https://github.com/TJUSSE/mailer) 完成）

## 安装库依赖

```bash
npm install
```

## 配置

`config/config.yml.example` 重命名为 `config/config.yml`，并参照说明完成配置

## 启动服务

```bash
npm start           # 按照配置文件中指定的时间推送
node push.js 18:00  # 每天 18:00 推送
```
