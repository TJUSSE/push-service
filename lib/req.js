var request = require('request');
var moment = require('moment');

var ejs = require('ejs');
var mailTemplate = require('fs').readFileSync('./template.ejs').toString();

module.exports = {
  sendTo: function (token, queue) {
    request.get({
      url: 'http://sse.tongji.edu.cn/sse_subscription/api/get_article/' + token + '/0',
    }, function (err, res, body) {
      body = JSON.parse(body);
      var mail_properties = {};
      body.forEach(function (article) {
        article.subscribe_mails.forEach(function (sub) {
          if (mail_properties[sub.mail] === undefined) {
            mail_properties[sub.mail] = {
              cancelToken: sub.cancel_token,
              mail: sub.mail,
              articles: []
            };
          }
          mail_properties[sub.mail].articles.push({
            body: article.body,
            category: {
              content: article.category_content,
              target: article.category_target,
            },
            link: article.link,
            title: article.title,
            publishAt: moment(parseInt(article.publish_at, 10)).format()
          });
        });
      });

      try {
        for (var mail in mail_properties) {
          queue.send({
            to: mail,
            subject: '2015-7-17 软院通知',
            html: ejs.render(mailTemplate, {data: mail_properties[mail]})
          });
          info('Pushed: %s (%d articles)', mail, mail_properties[mail].articles.length);
        }
      } catch(e) {
        error(e);
      }
    }
  }
};