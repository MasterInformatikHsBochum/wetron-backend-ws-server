var port = 8080,
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: port })
    winston = require('winston'),
    games = {},
    clients = {};

const logger = new (winston.Logger)({
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

logger.info('Listening on port: ' + port);

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        logger.info('Got message: ' + message);

        try {
            const m = JSON.parse(message);

            switch(m['e']) {
                // Spiel beitreten Request
                case 0:
                    // type == game and gameId is set
                    if (m['t'] == 'g' && m['g'] > 0) {
                        if (m['g'] in games) {
                            games[m['g']]['game'] = ws;
                            games[m['g']]['players'] = {};
                            clients[ws] = m['g'];
                        } else {
                            games[m['g']] = {
                                'game': ws,
                                'players': {}
                            }
                            clients[ws] = m['g'];
                        }

                        logger.info('Connected game container for game: ' + m['g']);
                    }
                    // type == controller and gameId is set
                    else if (m['t'] == 'c' && m['g'] > 0) {
                        // is game container started?
                        if ('game' in games[m['g']]) {
                            const player = Object.keys(games[m['g']]['players']).length + 1;
                            m['p'] = player;
                            if (player in games[m['g']]['players']) {
                                games[m['g']]['players'][player]['controller'] = ws;
                                clients[ws] = m['g'];
                            } else {
                                games[m['g']]['players'][player] = {
                                    'controller': ws
                                }
                                clients[ws] = m['g'];
                            }

                            logger.info('Connected controller for player ' + player + ' for game: ' + m['g']);

                            // send message to game container
                            if (games[m['g']]['game']) {
                                games[m['g']]['game'].send(JSON.stringify(m));
                            }
                        }
                    }
                    // type == view and gameId is set
                    else if (m['t'] == 'v' && m['g'] > 0) {
                        // is game container started?
                        if ('game' in games[m['g']]) {
                            const player = Object.keys(games[m['g']]['players']).length + 1;
                            m['p'] = player;
                            if (player in games[m['g']]['players']) {
                                games[m['g']]['players'][player]['view'] = ws;
                                clients[ws] = m['g'];
                            } else {
                                games[m['g']]['players'][player] = {
                                    'view': ws
                                }
                                clients[ws] = m['g'];
                            }

                            logger.info('Connected view for player ' + player + ' for game: ' + m['g']);

                            // send message to game container
                            if (games[m['g']]['game']) {
                                games[m['g']]['game'].send(JSON.stringify(m));
                            }
                        }
                    }
                    break;
                // view Spiel beitreten Response
                case 1:
                    if (m['g'] > 0 && m['p'] > 0) {
                        const player = m['p'];
                        delete m['p'];

                        logger.info('Sent connection response for view of player ' + player + ' for game: ' + m['g']);

                        // send message to view
                        if (games[m['g']]['players'][player]['view']) {
                            games[m['g']]['players'][player]['view'].send(JSON.stringify(m));
                        }

                        if (m['v']['success'] !== true) {
                            if (player in games[m['g']]['players']) {
                                delete clients[games[m['g']]['players'][player]['controller']];
                                delete games[m['g']]['players'][player]['view'];1
                            }
                        }
                    }
                    break;
                // Startup Request
                case 2:
                    if (m['g'] > 0 && m['p'] > 0) {
                        logger.info('Sent startup for player ' + m['p'] + ' for game: ' + m['g']);

                        // send message to controller
                        if (games[m['g']]['players'][m['p']]['controller']) {
                            games[m['g']]['players'][m['p']]['controller'].send(message);
                        }
                        // send message to view
                        if (games[m['g']]['players'][m['p']]['controller']) {
                            games[m['g']]['players'][m['p']]['controller'].send(message);
                        }
                    }
                    break;
                // Startup Response
                case 3:
                    if (m['g'] > 0 && m['p'] > 0) {
                        logger.info('Sent startup acknowledge for player ' + m['p'] + ' for game: ' + m['g']);

                        // send message to game container
                        if (games[m['g']]['game']) {
                            games[m['g']]['game'].send(message);
                        }
                    }
                    break;
                // Spiel startet -> Countdown
                case 4:
                    if (m['g'] > 0 && m['p'] > 0) {
                        logger.info('Sent game start for player ' + m['p'] + ' for game: ' + m['g']);

                        // send message to controller
                        if (games[m['g']]['players'][m['p']]['controller']) {
                            games[m['g']]['players'][m['p']]['controller'].send(message);
                        }
                        // send message to view
                        if (games[m['g']]['players'][m['p']]['view']) {
                            games[m['g']]['players'][m['p']]['view'].send(message);
                        }
                    }
                    break;
                // Spiel endet (Gewonnen / Verloren)
                case 5:
                    if (m['g'] > 0 && m['p'] > 0) {
                        logger.info('Sent game end for player ' + m['p'] + ' for game: ' + m['g']);

                        // send message to controller
                        if (games[m['g']]['players'][m['p']]['controller']) {
                            games[m['g']]['players'][m['p']]['controller'].send(message);
                        }
                        // send message to view
                        if (games[m['g']]['players'][m['p']]['view']) {
                            games[m['g']]['players'][m['p']]['view'].send(message);
                        }
                    }
                    break;
                // Richtung wechseln
                case 6:
                    if (m['g'] > 0 && m['p'] > 0) {
                        logger.info('Sent change direction for player ' + m['p'] + ' for game: ' + m['g']);

                        // send message to game container
                        if (games[m['g']]['game']) {
                            games[m['g']]['game'].send(message);
                        }
                    }
                    break;
                // Richtung wird mitgeteilt
                case 7:
                    if (m['g'] > 0 && m['p'] > 0) {
                        logger.info('Sent position for player ' + m['p'] + ' for game: ' + m['g']);

                        // send message to controller
                        if (games[m['g']]['players'][m['p']]['controller']) {
                            games[m['g']]['players'][m['p']]['controller'].send(message);
                        }
                        // send message to view
                        if (games[m['g']]['players'][m['p']]['view']) {
                            games[m['g']]['players'][m['p']]['view'].send(message);
                        }
                    }
                    break;
                // ctrl Spiel beitreten Response
                case 8:
                    if (m['g'] > 0 && m['p'] > 0) {
                        const player = m['p'];
                        delete m['p'];

                        logger.info('Sent connection response for controller of player ' + player + ' for game: ' + m['g']);

                        // send message to controller
                        if (games[m['g']]['players'][player]['controller']) {
                            games[m['g']]['players'][player]['controller'].send(JSON.stringify(m));
                        }

                        if (m['v']['success'] !== true) {
                            if (player in games[m['g']]['players']) {
                                delete clients[games[m['g']]['players'][player]['controller']];
                                delete games[m['g']]['players'][player]['controller'];
                            }
                        }
                    }
                    break;
                // Controller/View Verbindung verloren
                case 9:
                    // type == game and gameId is set
                    if (m['t'] == 'g' && m['g'] > 0) {
                        delete games[m['g']]['game'];
                        delete clients[ws];

                        logger.info('Disconnected game container for game: ' + m['g']);
                    }
                    // type == controller and gameId and playerId is set
                    else if (m['t'] == 'c' && m['g'] > 0 && m['p'] > 0) {
                        // is game container started?
                        if ('game' in games[m['g']]) {
                            if (m['p'] in games[m['g']]['players']) {
                                delete games[m['g']]['players'][m['p']]['controller'];
                                delete clients[ws];
                            }

                            logger.info('Disconnected controller for player ' + m['p'] + ' for game: ' + m['g']);

                            // send message to game container
                            if (games[m['g']]['game']) {
                                games[m['g']]['game'].send(message);
                            }
                        }
                    }
                    // type == view and gameId and playerId is set
                    else if (m['t'] == 'v' && m['g'] > 0 && m['p'] > 0) {
                        // is game container started?
                        if ('game' in games[m['g']]) {
                            if (m['p'] in games[m['g']]['players']) {
                                delete games[m['g']]['players'][m['p']]['view'];
                                delete clients[ws];
                            }

                            logger.info('Disconnected view for player ' + m['p'] + ' for game: ' + m['g']);

                            // send message to game container
                            if (games[m['g']]['game']) {
                                games[m['g']]['game'].send(message);
                            }
                        }
                    }
                    break;
            }
        } catch(e) {
            logger.error(e);
        }
    });

    ws.on('close', function() {
        if (ws in clients) {
            var game = clients[ws];

            if (game in games) {
                if (games[game]['game'] == ws) {
                    logger.info('Disconnected game container for game: ' + game);

                    for (player in games[game]['players']) {
                        var message = JSON.stringify({
                            'g': game,
                            'e': 1,
                            'p': player,
                            't': 'g',
                            'v': undefined
                        });

                        try {
                            // send message to controller container
                            if (games[game]['players'][player]['controller']) {
                                games[game]['players'][player]['controller'].send(message);
                                games[game]['players'][player]['controller'].close();
                                delete clients[games[game]['players'][player]['controller']];
                                delete games[game]['players'][player]['controller'];
                            }                                                    
                        } catch (e) {
                            logger.error(e);
                        }

                        try {
                            // send message to view container
                            if (games[game]['players'][player]['view']) {
                                games[game]['players'][player]['view'].send(message);
                                games[game]['players'][player]['view'].close();
                                delete clients[games[game]['players'][player]['view']];
                                delete games[game]['players'][player]['view'];
                            }
                        } catch (e) {
                            logger.error(e);
                        }
                    }

                    delete clients[games[game]['game']];
                    delete games[game]['game'];
                }

                for (player in games[game]['players']) {
                    if (games[game]['players'][player]['controller'] == ws) {
                        logger.info('Disconnected controller for player ' + player + ' for game: ' + game);

                        const message = JSON.stringify({
                            'g': game,
                            'e': 1,
                            'p': player,
                            't': 'c',
                            'v': undefined
                        });

                        // send message to game container
                        if (games[game]['game']) {
                            try {
                                games[game]['game'].send(message);
                            } catch (e) {
                                logger.error(e);
                            }
                        }
                        // send message to view container
                        if (games[game]['players'][player]['view']) {
                            try {
                                games[game]['players'][player]['view'].send(message);
                            } catch (e) {
                                logger.error(e);
                            }
                        }

                        delete games[game]['players'][player]['controller'];
                    } else if (games[game]['players'][player]['view'] == ws) {
                        logger.info('Disconnected view for player ' + player + ' for game: ' + game);

                        const message = JSON.stringify({
                            'g': game,
                            'e': 1,
                            'p': player,
                            't': 'v',
                            'v': undefined
                        });

                        // send message to game container
                        if (games[game]['game']) {
                            try {
                                games[game]['game'].send(message);
                            } catch (e) {
                                logger.error(e);
                            }
                        }
                        // send message to controller container
                        if (games[game]['players'][player]['controller']) {
                            try {
                                games[game]['players'][player]['controller'].send(message);
                            } catch (e) {
                                logger.error(e);
                            }
                        }

                        delete games[game]['players'][player]['view'];
                    }
                }
            }
        }
    });
});
