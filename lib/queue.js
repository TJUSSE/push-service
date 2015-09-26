/*global debug, info */

var amqp = require('amqplib');

var Queue = function (mqOptions) {
  this.options = mqOptions;
};

Queue.prototype.init = function (callback) {
  var q = this;

  var open = amqp.connect(this.options.mconnection);
  debug('Connecting to RabbitMQ server...');

  open.then(function (connection) {
    info('Server connected.');
    return connection.createChannel();
  }).then(function (channel) {
    info('Channel connected.');
    q.channel = channel;
    return q.channel.assertExchange(q.options.exchange.name, q.options.exchange.type, q.options.exchange.options);
  }).then(function () {
    info('Exchange declared, name = %s, type = %s, options = %j.', q.options.exchange.name, q.options.exchange.type, q.options.exchange.options, {});
    info('Message queue is ready.');
    callback();
  });
};

Queue.prototype.send = function (message) {
  this.channel.publish(this.options.exchange.name, this.options.binding.name, new Buffer(JSON.stringify(message)), {
    persistent: true,
    priority: 0
  });
};

module.exports = function (opt) {
  return new Queue(opt);
};
