var port = 8080,
    host = 'localhost'
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

const ws = new WebSocket('ws://' + host + ':' + port);
const player = 1;

ws.on('open', function() {
    ws.send('{"g":1,"e":0,"p":1,"t":"c"}');
});

ws.on('message', function(message) {
    logger.info('Player ' + player + ' controller got message: ' + message);
});
