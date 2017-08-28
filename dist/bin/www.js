#!/usr/bin/env node
"use strict";

/**
 * Module dependencies.
 */

var app = require('../index');
var http = require("http");
var socketIO = require("socket.io");
var redis = require("redis").createClient;
var adapter = require("socket.io-redis");
var config = require('../app/config');
var logger = require("../app/logger");

require("../app/socket");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create socket.io server.
 */
var server = http.createServer(app);
var io = socketIO(server);
// implement redis
io.set("transports", ["websocket"]);
var pubClient = redis(config.redis.port, config.redis.host, {
  auth_pass: config.redis.password
});
var subClient = redis(config.redis.port, config.redis.host, {
  return_buffers: true,
  auth_pass: config.redis.password
});
io.adapter(adapter({
  pubClient: pubClient,
  subClient: subClient
}));

io.use(function (socket, next) {
  require("../app/session")(socket.request, {}, next);
});
require("../app/socket")(io, app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // console.error(bind + ' requires elevated privileges');
      logger.log("error", bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // console.error(bind + ' is already in use');
      logger.log("error", bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  logger.log("debug", 'Listening on ' + bind);
}
//# sourceMappingURL=www.js.map