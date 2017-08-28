'use strict';

var winston = require('winston');

var logger = new winston.Logger({
    transports: [new winston.transports.File({
        level: "debug",
        filename: './appDebug.log',
        handleExceptions: true
    }), new winston.transports.Console({
        level: "debug",
        json: true,
        handleExceptions: true
    })],
    exitOnError: false
});

module.exports = logger;
//# sourceMappingURL=index.js.map