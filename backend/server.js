const { port, env } = require("./config/vars");
const logger = require("./config/logger");
const app = require("./config/express");
const mongoose = require("./config/mongoose");

var http = require("http"),
  https = require("https");

var fs = require("fs");

// open mongoose connection
mongoose.connect();

// listen to requests
var server = http.createServer({}, app);
server.listen(port, () => {
  console.log(`server started with http on port ${port} (${env})`);
  logger.info(`server started with http on port ${port} (${env})`);
});

/**
 * Exports express
 * @public
 */
module.exports = app;
