import {timeLog} from './PCKUtilsClient'

const WINNING_SCORE = 10;

export class GameModel {

  status = "No room created yet";

  constructor(_gameID) {
    this.gameID = _gameID;
    this.status = "game created";
    this.playerNumTurn = 0;
    this.player1Name = "n/a1";
    this.player2Name = "n/a2";
    //this.board = new Board(this);
    //this.board = new Board(this.reportWinner);
    //this.player1 = new PlayerBoard();
    //this.player2 = new PlayerBoard();
    timeLog(`GameModel(): _gameID:${_gameID};`);
  }

  setPlayerName(playerNum, playerName) {
    timeLog(`GameModel.setPlayerName: playerNum:${playerNum}, playerName:${playerName};`)
    let playerNumInt = parseInt(playerNum);
    if (playerNumInt == 1) {
      //this.board.setPlayer1Name(playerName);
      this.player1Name = playerName;
      this.status = "player 1 joined, waiting for player 2";
    } else {
      //this.board.setPlayer2Name(playerName);
      this.status = "player 2 joined, game is on";
      this.playerNumTurn = 1;
    }
  }

}
