import express from "express"
const app = express()
app.use(express.json())
import {timeLog} from "./shared_lib/PCKUtils.js"
//import {timeLog} from "./common/PCKUtilsServer.js"
//const {timeLog} = pkg;
import {Context} from "./Context.js";


let version = "v0.1"

app.get("/api", (req, res) => {
  timeLog(`serverBattleship: get./api;`);
  res.json({
    version: version
  })
});

app.post("/games", (req, res) => {
  timeLog(`serverBattleship.get:/games;`);
  let resMsg = "ERROR";
  let playerName = req.body.playerName;
  let newGame = Context.Instance.newGame(playerName);
  if (newGame != null) {
    resMsg = `a new game is created`;
  }
  res.send({
    results:resMsg,
    gameID:newGame.gameID,
  });
});

app.post("/games/:gameID/join", (req, res) => {
  timeLog(`serverBattleship.post:/games/:gameID/join;`);
  let resMsg = "OK";
  let resGameID = "n/a";
  let gameID = parseInt(req.params.gameID);
  let playerName = req.body.playerName;
  timeLog(`serverBattleship.post:/games/:gameID/join: gameID:${gameID}; playerName:${playerName};`);
  let aGame = Context.Instance.games.get(parseInt(gameID));
  if (aGame == undefined) {
    resMsg = "ERROR - game does not existed.";
  } else {
    resGameID = aGame.gameID;
    aGame.setPlayerName(2, playerName);
  }
  res.send({
    results:resMsg,
    gameID:resGameID,
  });
});

/*
app.get("/games/:gameID", (req, res) => {
  let gameID = parseInt(req.params.gameID);
  //timeLog(`server.app.get:/games/:gameID:${gameID}`);
  let aGame = Context.Instance.games.get(gameID);
  res.send({game:aGame});
});
*/

app.get("/games/:gameID/:playerNum", (req, res) => {
  let gameID = parseInt(req.params.gameID);
  let playerNum = parseInt(req.params.playerNum);
  timeLog(`server.app.get:/games/:gameID:${gameID}/:playerNum:${playerNum}`);
  let aGame = Context.Instance.games.get(gameID);
  res.send({game:aGame});
});

app.post("/games/:gameID/placements", (req, res) => {
  timeLog(`serverBattleship.post:/games/:gameID/placements;`);
  let gameID = parseInt(req.params.gameID);
  let playerNum = req.body.playerNum;
  let placements = req.body.placements;
  timeLog(`serverBattleship.post:/games/:gameID/placements; gameID:${gameID}, playerNum:${playerNum}, placements:${placements};`);
  let aGame = Context.Instance.games.get(gameID);
  aGame.setPlacements(playerNum, placements);
  let resMsg = "OK";
  res.send({
    results:resMsg,
  });
});

app.post("/games/:gameID/attack", (req, res) => {
  timeLog(`serverBattleship.post:/games/:gameID/attack;`);
  let gameID = parseInt(req.params.gameID);
  let playerNum = req.body.playerNum;
  let row = parseInt(req.body.row);
  let col = parseInt(req.body.col);
  timeLog(`serverBattleship.post:/games/:gameID/attack; gameID:${gameID}, playerNum:${playerNum}, [${row},${col}];`);
  let aGame = Context.Instance.games.get(gameID);
  let [isHit, message] = aGame.attack(playerNum, row, col);
  timeLog(`serverBattleship.post:/games/:gameID/attack; isHit:${isHit}, message:${message};`);
  let resMsg = "OK";
  res.send({
    isHit: isHit,
    message: message,
  });
});

app.listen(5000, () => {
  //timeLog("serverBattleship: Server started on port 5000 pck; 3.3");
  timeLog("serverBattleship: Server started on port 5000; pck: 3.3");
  //prep1();

  /*
  let x = 7;
  let y = 23;
  PCKUtils.timeLog(`__${x} + ${y} = ${PCKUtils.add(x,y)};`)

  Context.init();
  Context.showAllGames();

  Context.createGame(2);
  Context.showAllGames();

  Context.createGame(25);
  Context.createGame(7);
  Context.showAllGames();
  */
})