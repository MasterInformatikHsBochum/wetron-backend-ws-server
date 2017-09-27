# wetron-backend-ws-server

## Ablauf aus Spielersicht

### Server erstellen (wird später implementiert)

1. WeTron Spieleliste im Browser öffnen
1. Spiel erstellen (Anzahl Spiel + Spielname) -> WeTron Spiellobby öffnet sich

### Mitspieler betreten das Spiel

1. WeTron Spieleliste im Browser öffnen (vorläufig wird immer ein Spiel mit 2 Spielern angezeigt)
1. Spiel beitreten -> WeTron Spielelobby öffnet sich

### Controller verbinden

1. Spielelobby: eigener QR-Code (enthält eindeutige Spieler-Id) wird angezeigt
1. QR-Code mit Smartphone einscannen -> Controller verbindet sich mit Server
1. Warten auf andere Spieler... -> Warten auf festgelegte Anzahl von Spielern

### In-Game

1. Countdown
1. Spiel startet
1. Du hast gewonnen / Du hast verloren
1. Spiel wird beendet, sobald jeder gewonnen oder verloren hat

## Kommunikation View <-> Rest

|Aktion                                         |Request                        |Response                           |
|-----------------------------------------------|-------------------------------|-----------------------------------|
|Spieleliste Request                            |/games                         |[ { "id": 1 }, {"id": 2 } ]        |

## Kommunikation View <-> Game

|Aktion                                         |Nachricht                                                                      |
|-----------------------------------------------|-------------------------------------------------------------------------------|
|view->game Spiel beitreten Request             |{ "g": 1,         "t": "v", "e": 0, "v": null }                                |
|game->view Spiel beitreten Response            |{ "g": 1, "p": 1, "t": "g", "e": 1, "v": { "success": true, "o": [2,3,4] } }            |
|game->view Spiel startet -> Countdown          |{ "g": 1, "p": 1, "t": "g", "e": 4, "v": { "countdown-ms": 3000 } }            |
|game->view Richtung wird mitgeteilt            |{ "g": 1, "p": 1, "t": "g", "e": 7, "v": [{"p": 1, "x": 1, "y": 2, "d": 0.0 }, {"p": 2, "x": 5, "y": 10, "d": 0.5 }, ...]|
|game->view Spiel endet (Gewonnen / Verloren)   |{ "g": 1, "p": 1, "t": "g", "e": 5, "v": { "win": true } }                     |

## Kommunikation Controller <-> Game

|Aktion                                         |Nachricht                                                                      |
|-----------------------------------------------|-------------------------------------------------------------------------------|
|ctrl->game Spiel beitreten Request             |{ "g": 1, "p": 1, "t": "c", "e": 0, "v": null }                          |
|game->ctrl Spiel beitreten Response            |{ "g": 1, "p": 1, "t": "g", "e": 8, "v": { "success": true } }                 |
|game->ctrl Spiel Startet -> Countdown          |{ "g": 1, "p": 1, "t": "g", "e": 4, "v": { "countdown-ms": 3000 } }            |
|ctrl->game Richtung wechseln                   |{ "g": 1, "p": 1, "t": "c", "e": 6, "v": { "d": 0 } } // r: 90, l: 360       |
|game->ctrl Spiel endet (Gewonnen / Verloren)   |{ "g": 1, "p": 1, "t": "g", "e": 5, "v": { "win": true } }                     |

## Kommunikation WS <-> Game

|Aktion                                         |Nachricht                              |
|-----------------------------------------------|---------------------------------------|
|wss->game Controller/View Verbindung verloren  |{ "g": 1, "p": 1, "t": "c", "e": 9 }   |
