const express = require("express")
//import express from "express";
const app = express()
app.use(express.json())
//import {PCKUtils} from "./src/PCKUtils.js"
const {timeLog} = require("./src/PCKUtilsServer");
const {Context} = require('./src/Context');
//const {Game} = require("./src/Game");


let player1Name = "Philip";
let player2Name = "Ken";

app.get("/api", (req, res) => {
  res.json({
    player1: player1Name,
    player2: player2Name,
  })
})
/*
app.post("/player/:playerNumber", (req, res) => {
  timeLog(`server.app.post:/player/:playerNumber: 1.0`);
  let playerNumber = req.params.playerNumber;
  let name = req.body.name;
  if (playerNumber == 1) {
    player1Name = name;
  }
  if (playerNumber == 2) {
    player2Name = name;
  }
  res.send("OK");
});
*/

app.get("/context", (req, res) => {
  res.send(Context.getContextInfo());
})

app.get("/games", (req, res) => {
  res.send({games:Array.from(Context.games).map(([key, value]) => value.getGameInfo())});
})

app.post("/games", (req, res) => {
  let resMsg = "ERROR";
  let playerName = req.body.playerName;
  let newGame = Context.newGame(playerName);
  if (newGame != null) {
    resMsg = `a new game is created`;
  }
  res.send({
    results:resMsg,
    gameID:newGame.gameID,
  });
})

/*
app.get("/games/:gameID", (req, res) => {
  let gameID = parseInt(req.params.gameID);
  let aGame = Context.games.get(gameID);
  res.send({game:aGame.getGameInfo()});
})
*/

app.get("/games/:gameID", (req, res) => {
  let gameID = parseInt(req.params.gameID);
  //timeLog(`server.app.get:/games/:gameID:${gameID}`);
  let aGame = Context.games.get(gameID);
  res.send({game:aGame});
})

app.post("/games/:gameID", (req, res) => {
  timeLog(`server.app.post:/games/:gameID: 1.0`);
  let gameID = req.params.gameID;
  timeLog(`server.app.post: gameID:${gameID};`);
  let playerNum = req.body.playerNum;
  let x = req.body.x;
  let y = req.body.y;
  timeLog(`server.app.post:/games/:gameID: [${gameID},${playerNum},${x},${y}];`);

  let aGame = Context.games.get(parseInt(gameID));
  if (aGame == undefined) {
    timeLog(`__ERROR aGame undefined;`);
    res.send({results:"send move failed"});
  } else {
    aGame.move(playerNum, x, y);
    res.send({results:"send move OK"});
  }
});

app.post("/games/:gameID/join", (req, res) => {
  timeLog(`server.app.post:/games/:gameID/join: 1.0`);
  let resMsg = "OK";
  let resGameID = "n/a";
  let gameID = parseInt(req.params.gameID);
  let playerName = req.body.playerName;
  timeLog(`server.app.post:/games/:gameID/join: gameID:${gameID}; playerName:${playerName};`);
  let aGame = Context.games.get(parseInt(gameID));
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
app.get('/api/:version', function(req, res) {
  res.send(req.params.version);
});
*/
function prep1() {
  timeLog(`server.prep1: 1.0;`);
  hardCodeGameID=23;
  newGameID = (Context.newGame(hardCodeGameID)).gameID; 
  timeLog(`server.prep1: newGameID:${newGameID};`);
  let aGame = Context.games.get(hardCodeGameID);
  aGame.init("Bob", "Tracy");
  aGame.move(1, 3, 6, "S");
  aGame.move(2, 7, 8, "P");
  aGame.move(2, 0, 0, "0");
}

app.listen(5000, () => {
  timeLog("game_battleship: server: Server started on port 5000 pck; 2.2");
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