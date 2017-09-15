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

|Aktion                                         |Nachricht                                                          |
|-----------------------------------------------|-------------------------------------------------------------------|
|view->game Spiel beitreten Request             |{ "g": 1, "e": 3, "v": {} }                             |
|game->view Spiel beitreten Response            |{ "g": 1, "e": 4, "v": { "player-id": 1 } }                        |
|game->view Spiel startet -> Countdown          |{ "g": 1, "e": 5, "v": { "countdown-ms": 3000 } }                  |
|game->view Position wird mitgeteilt            |{ "g": 1, "e": 6, "v": { "d":0.0, "x":0, "y":0 } }                 |
|game->view Spiel endet (Gewonnen / Verloren)   |{ "g": 1, "e": 7, "v": { "win": true } }                           |

## Kommunikation Controller <-> Game

|Aktion                                         |Nachricht                                                          |
|-----------------------------------------------|-------------------------------------------------------------------|
|ctrl->game Connect Request                     |{ "g": 1, "e": 8, "v": { "player-id": 1 } }                        |
|game->ctrl Connect Response                    |{ "g": 1, "e": 9, "v": { "success": true } }                       |
|game->ctrl Spiel Startet -> Countdown          |{ "g": 1, "e": 10, "v": { "countdown-ms": 3000 } }                 |
|ctrl->game Richtung wechseln                   |{ "g": 1, "e": 11, "v": { "d": 0.0 } }                             |
|game->ctrl Spiel endet (Gewonnen / Verloren)   |{ "g": 1, "e": 12, "v": { "win": true } }                          |

## Kommunikation WS <-> Game

### Aufgaben von WS

* Leitet Anfragen von außen an den jeweiligen Docker-Container um in dem das Spiel ausgeführt wird.
* Vergibt für jede Verbindung eine eindeutige ID und sendet diese mit jeder eingehenden Nachricht zum Spiel.
* Teilt dem jeweiligen Spiel mit, wenn eine Verbindung abbricht

```json
{ "id": 1, "msg": {} }
```

|Aktion                                         |Nachricht                                                      |
|-----------------------------------------------|---------------------------------------------------------------|
|ws->game Verbindung verloren                   |{ "id": 1, "msg": { "event": 13} }                             |

* id: Einzigartige Id pro Verbindung
* msg: Dateninhalt
