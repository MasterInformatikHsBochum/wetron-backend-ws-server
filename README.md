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

## Kommunikation View <-> Game

|Aktion                                         |Message                                                        |
|-----------------------------------------------|---------------------------------------------------------------|
|view->game Spieleliste Request                 |{ "event": 1 }                                                 |
|game->view Spieleliste Response                |{ "event": 2, "v": { "games": [ { "id": 1 }, {"id": 2 }] }}    |
|view->game Spiel beitreten Request             |{ "event": 3, "v": { "game": 1 } }                             |
|game->view Spiel beitreten Response            |{ "event": 4, "v": { "player-id": 1 } }                        |
|game->view Spiel startet -> Countdown          |{ "event": 5, "v": { "countdown-ms": 3000 } }                  |
|game->view Position wird mitgeteilt            |{ "event": 6, "v": { "d":0.0, "x":0, "y":0 } }                 |
|game->view Spiel endet (Gewonnen / Verloren)   |{ "event": 7, "v": { "win": true } }                           |

## Kommunikation Controller <-> Game

|Aktion                                         |Message                                                        |
|-----------------------------------------------|---------------------------------------------------------------|
|ctrl->game Connect Request                     |{ "event": 8, "v": { "player-id": 1 } }                        |
|game->ctrl Connect Response                    |{ "event": 9, "v": { "success": true } }                       |
|game->ctrl Spiel Startet -> Countdown          |{ "event": 10, "v": { "countdown-ms": 3000 } }                 |
|ctrl->game Richtung wechseln                   |{ "event": 11, "v": { "d": 0.0 } }                             |
|game->ctrl Spiel endet (Gewonnen / Verloren)   |{ "event": 12, "v": { "win": true } }                          |
