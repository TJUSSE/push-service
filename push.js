/*global GLOBAL, info */

// load configurations
var configLoader = require('./lib/configLoader.js');
var config = configLoader.loadYaml('config');

// logger
var logger = require('./lib/logger.js')(config.stdLogLevel);
logger.expose(GLOBAL);

// read schedule time from commandline
var argv = require('optimist').argv;
var hour = null, minute = null;

if (argv._.length > 0) {
  var p = argv._[0].split(':');
  hour = p[0];
  minute = p[1];
}

if (hour == null || minute == null) {
  hour = config.defaultCron.hour;
  minute = config.defaultCron.minute;
}

info('Current schedule time is %d:%d.', hour, minute);

// prepare other stuff
var queue = require('./lib/queue.js')(config.mq);
var cron = require('./lib/cron.js');
var req = require('./lib/req.js');

queue.init(function () {
  cron.cron(hour, minute, function () {
    info('Push activated.');
    req.sendTo(config.api, queue);
  });
});
