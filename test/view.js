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
const type = 'v';

ws.on('open', function() {
    var m = {
        'g': game,
        'p': player,
        't': type,
        'e': 0,
        'v': undefined
    };

    // view->game Spiel beitreten Request
    logger.info('Sending "view->game Spiel beitreten Request"');
    ws.send(JSON.stringify(m));
});

ws.on('message', function(message) {
    try {
        logger.debug('Got message: ' + message);
        var m = JSON.parse(message);

        if (m['e'] == 8 && m['v']['success'] == true) {
            logger.info('Got "game->view Spiel beitreten Response"');
        } else if (m['e'] == 4) {
            logger.info('Got "game->view Spiel Startet -> Countdown"');
        } else if (m['e'] == 7) {
            logger.info('Got "game->view Richtung wird mitgeteilt"');
            logger.info(m['v']);
        } else if (m['e'] == 5) {
            logger.info('Got "game->view Spiel endet (Gewonnen / Verloren)"');
            logger.info(m['v']);
        }
    } catch (e) {
        logger.error(e);
    }
});

ws.on('close', function() {
    logger.error('Connection was closed');
    process.exit();
});
