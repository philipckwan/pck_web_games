const {timeLog} = require("./PCKUtilsServer");

class Player {
  playerName = "n/a2";
  playerScore = 0;

  constructor() {
    timeLog(`Player(): 1.0;`);
  }
}

exports.Player = Player;