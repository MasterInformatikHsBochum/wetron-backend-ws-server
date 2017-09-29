var port = 8000,
    host = '5.45.108.170',
    WebSocket = require('ws'),
    winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: true,
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ]
});

const ws = new WebSocket('http://' + host + ':' + port);

ws.on('open', function() {
    ws.send('{"g":1,"e":0,"t":"g"}');;
});

ws.on('message', function(message) {
    logger.info('Game container got message: ' + message);
});
