var CronJob = require('cron').CronJob;

module.exports = {
  cron: function (hour, minute, callback) {
    new CronJob('0 ' + minute + ' ' + hour + ' * * *', callback, null, true, 'Asia/Shanghai');
  }
};