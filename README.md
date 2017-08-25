
# wetron-backend-ws-server

## Protocol

### messages
```json
{"g":0,"e":0,"p":0,"v":{}}
```

- g: gameId (*int*)
- e: eventType (*int*)
- p: playerId (*int*)
- v: value (*any*)

### events

| index | name | source | destination | example | comment |
|---|---|---|---|---|---|
| 0 | connect | client | game server | {"p":0} | |
| 1 | disconnect | client | game server | {"p":0} | |
| 2 | startup | game server | client | {"d":0.0,"x":0,"y":0} | |
| 3 | startup acknowledge | client | game server | {"p":0,"d":0.0,"x":0,"y":0} | |
| 4 | game start | game server | client | {"t":3000} | time in milliseconds til start |
| 5 | game end | game server | client | {"s":0} | 0: game is over, 1: you win, 2: you lost |
| 6 | change direction | client | game server | {"d":0.0} | |
| 7 | position | game server | clients | {"p":0,"d":0.0,"x":0,"y":0} | |
