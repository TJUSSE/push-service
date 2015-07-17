var argv = require('optimist').argv;
var request = require('request');

var hour = null, minute = null;
var token = 'ceeded729d8c61a44331ed8c7402e354';

if (argv['_'].length > 0) {
  var p = argv['_'];
  p = p[0].split(':');
  var hour = p[0];
  var minute = p[1];
}

if (hour == null || minute == null) {
  hour = 17;
  minute = 0;
}

var CronJob = require('cron').CronJob;
new CronJob('0 ' + minute + ' ' + hour + ' * * *', function() {
  console.log('Schedule...');

  request.get({
    url: 'http://sse.tongji.edu.cn/sse_subscription/api/get_article/' + token + '/0',
  }, function (err, res, body) {
    console.log(body);
  });

}, null, true, 'Asia/Shanghai');