const {Board} = require("./Board");
const {timeLog} = require("./PCKUtilsServer");

const WINNING_SCORE = 10;

class Game {

  status = "No room created yet";

  constructor(_gameID) {
    this.gameID = _gameID;
    this.status = "game created";
    this.playerNumTurn = 0;
    //this.board = new Board(this);
    this.board = new Board(this.reportWinner);
    //this.player1 = new PlayerBoard();
    //this.player2 = new PlayerBoard();

  }
  
  /*
  init(player1Name, player2Name) {
    this.player1.init(player1Name);
    this.player2.init(player2Name);
  }
  */
  
  setPlayerName(playerNum, playerName) {
    let playerNumInt = parseInt(playerNum);
    if (playerNumInt == 1) {
      this.board.setPlayer1Name(playerName);
      this.status = "player 1 joined, waiting for player 2";
    } else {
      this.board.setPlayer2Name(playerName);
      this.status = "player 2 joined, game is on";
      this.playerNumTurn = 1;
    }
  }

  move(playerNum, x, y) {
    this.board.markWithPlayerNum(playerNum, x, y);
    if (this.board.player1.playerScore >= WINNING_SCORE) {
      this.playerNumTurn = 0;
      this.status = `Player 1 wins!`;
    } else if (this.board.player2.playerScore >= WINNING_SCORE) {
      this.playerNumTurn = 0
      this.status = `Player 2 wins!`;
    } else {
      this.playerNumTurn = playerNum == 1 ? 2 : 1;
      this.status = `now is player ${this.playerNumTurn}'s turn`;
    }

    /*
    if (playerNum == 1) {
      this.player1.mark(x, y, symbol);
    } else if (playerNum == 2) {
      this.player2.mark(x, y, symbol);
    } else {
      timeLog(`Game.move: ERROR - invalid playerNum;`);
    }
    */
  }

  getGameInfo() {
    return {
      gameID: this.gameID,
      status: this.status,
    }
  }
  /*
  reportWinner(playerNum) {
    timeLog(`Game.reportWinner: playerNum:${playerNum}; gameID:${this.gameID};`);
    this.status = `Player ${playerNum} wins! gameID:${this.gameID};`;
  }
  */

}

exports.Game = Game;