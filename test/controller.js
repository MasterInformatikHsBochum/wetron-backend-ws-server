var port = 8000,
    host = '5.45.108.170',
    WebSocket = require('ws'),
    winston = require('winston'),
    keypress = require('keypress');

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
var player = 1;
process.argv.forEach(function (val, index, array) {
    if (val.startsWith('g=')) {
        game = parseInt(val.slice(2));
    } else if (val.startsWith('p=')) {
        player = parseInt(val.slice(2));
    }
});

const ws = new WebSocket('ws://' + host + ':' + port);
var direction;
const type = 'c';

ws.on('open', function() {
    var m = {
        'g': game,
        'p': player,
        't': type,
        'e': 0,
        'v': undefined
    };

    // ctrl->game Spiel beitreten Request
    logger.info('Sending "ctrl->game Spiel beitreten Request"');
    ws.send(JSON.stringify(m));
});

ws.on('message', function(message) {
    try {
        logger.debug('Got message: ' + message);
        var m = JSON.parse(message);

        if (m['e'] == 8 && m['v']['success'] == true) {
            logger.info('Got "game->ctrl Spiel beitreten Response"');
        } else if (m['e'] == 4) {
            logger.info('Got "game->ctrl Spiel Startet -> Countdown"');
        }
    } catch (e) {
        logger.error(e);
    }
});

ws.on('close', function() {
    logger.error('Connection was closed');
    process.exit();
});

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    if (key && key.ctrl && key.name == 'c') {
        process.exit();
    } else if (key && key.name == 'left') {
        direction = 270;
        var m = {
            'g': game,
            'p': player,
            't': type,
            'e': 6,
            'v': {
                'd': direction
            }
        };
        console.log(JSON.stringify(m));
        ws.send(JSON.stringify(m));
    } else if (key && key.name == 'right') {
        direction = 90;
        var m = {
            'g': game,
            'p': player,
            't': type,
            'e': 6,
            'v': {
                'd': direction
            }
        };
        console.log(JSON.stringify(m));
        ws.send(JSON.stringify(m));
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();
