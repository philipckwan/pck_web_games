import express from "express"
const app = express()
app.use(express.json())
import {timeLog} from "./shared_lib/PCKUtils.js"
//import {timeLog} from "./common/PCKUtilsServer.js"
//const {timeLog} = pkg;
//const {Context} = require('./src/Context');


let version = "v0.1"

app.get("/api", (req, res) => {
  timeLog(`serverBattleship: get./api;`);
  res.json({
    version: version
  })
})

app.listen(5000, () => {
  //timeLog("serverBattleship: Server started on port 5000 pck; 3.3");
  timeLog("serverBattleship: Server started on port 5000 pck; 3.3");
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