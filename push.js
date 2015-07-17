// load configurations
var configLoader = require('./lib/configLoader.js');
var config = configLoader.loadYaml('config');

// logger
var logger = require('./lib/logger.js')(config.stdLogLevel);
logger.expose(GLOBAL);

// read schedule time from commandline
var argv = require('optimist').argv;
var hour = null, minute = null;

if (argv['_'].length > 0) {
  var p = argv['_'];
  p = p[0].split(':');
  var hour = p[0];
  var minute = p[1];
}

if (hour == null || minute == null) {
  hour = config.defaultCron.hour;
  minute = config.defaultCron.minute;
}

// prepare other stuff
var queue = require('./lib/queue.js');
var cron = require('./lib/cron.js');
var req = require('./lib/req.js');

queue.prepare(config.mq, function () {
  cron.cron(hour, minute, function () {
    info('Scheduled');
    req.sendTo(config.apiToken, queue);
  });
});