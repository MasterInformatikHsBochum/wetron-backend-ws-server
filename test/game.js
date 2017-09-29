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

var game = 1;
process.argv.forEach(function (val, index, array) {
    if (val.startsWith('g=')) {
        game = parseInt(val.slice(2));
    }
});

const ws = new WebSocket('ws://' + host + ':' + port);
const type = 'g';

ws.on('open', function() {
    var m = {
        'g': game,
        't': type,
        'e': 0
    };

    ws.send(JSON.stringify(m));
});

ws.on('message', function(message) {
    logger.info('Game container got message: ' + message);
});
