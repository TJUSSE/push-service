var amqp = require('amqp');

var lib = module.exports = {

  send: function (message) {
    lib.exchange.publish(lib.config.queue.name, JSON.stringify(message));
  },

  prepare: function (mq, callback) {
    lib.config = mq;
    var connection = amqp.createConnection(mq.connection);
    debug('Connecting to RabbitMQ server...');

    connection.on('ready', function () {
      info('Server connected.');

      debug('Declaring exchange (exchange name=%s)', mq.exchange.name);
      connection.exchange(mq.exchange.name, mq.exchange.options, function (exchange) {
        info('Exchange %s opened.', mq.exchange.name);
        lib.exchange = exchange;
        debug('Connecting to queue (queue name=%s)', mq.queue.name);
        connection.queue(mq.queue.name, mq.queue.options, function (q) {
          q.bind(exchange, mq.queue.name);
          info('Message queue is ready.');
          callback();
        });
      });
    });
  }
};