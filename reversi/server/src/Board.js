const {timeLog} = require("./PCKUtilsServer");
const {Player} = require("./Player");

const SYMBOL_O = 'O';
const SYMBOL_X = 'X';
const SYMBOL_EMPTY = '';

class Board {
  boardID = -1;
  player1 = undefined;
  player2 = undefined;
  //player1Name = "n/a";
  //player2Name = "n/a";
  board = Array(10).fill(0).map(row => new Array(10).fill(SYMBOL_EMPTY));
  callback = undefined;

  constructor(gameCallback) {
    timeLog(`Board(): 1.0;`);
    this.boardID = Math.floor(Math.random() * (999 - 1) + 1);
    timeLog(`Board(): new with boardID:${this.boardID};`);
    this.player1 = new Player();
    this.player2 = new Player();
    this.callback = gameCallback;
  }

  setPlayer1Name(_playerName) {
    this.player1.playerName = _playerName;
    //timeLog(`Board.setPlayerName: board [${this.boardID}] with player 1 [${this.playerName}];`);
  }

  setPlayer2Name(_playerName) {
    this.player2.playerName = _playerName;
    this.markWithPlayerNum(1, 4, 4);
    this.markWithPlayerNum(2, 4, 5);
    this.markWithPlayerNum(2, 5, 4);
    this.markWithPlayerNum(1, 5, 5);
   //timeLog(`Board.setPlayerName: board [${this.boardID}] with player 2 [${this.playerName}];`);
  }

  getMySymbol(playerNum) {
    return playerNum == 1 ? SYMBOL_O : SYMBOL_X;
  }

  getOpponentSymbol(playerNum) {
    return playerNum == 1 ? SYMBOL_X : SYMBOL_O;
  }

  incrementMyScore(playerNum) {
    timeLog(`Board.incrementMyScore: playerNum:${playerNum};`);
    if (playerNum == 1) {
      this.player1.playerScore = this.player1.playerScore + 1;
    } else {
      this.player2.playerScore = this.player2.playerScore + 1;
    }
  }

  /*
  mark(x, y, symbol) {
    this.board[x][y] = symbol;
    timeLog(`Board.mark: x:${x}; y:${y}; symbol:${symbol};`);
  }
  */

  checkCellsInDirection(me, x, y, dx, dy) {
      let i = x + dx;
      let j = y + dy;
      let opponentSymbol = this.getOpponentSymbol(me);
      let mySymbol = this.getMySymbol(me);
      let result = [];

      while (i >= 0 && i < 10 && j >= 0 && j < 10) {
          if (this.board[i][j] === opponentSymbol) {
              result.push([i, j]);
          } else if (this.board[i][j] === mySymbol) {
              return result;
          } else {
              return [];
          }
          i += dx;
          j += dy;
      }
      return [];
  }

  markWithPlayerNum(me, x, y) {
      this.board[x][y] = this.getMySymbol(me);
      let directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (let [dx, dy] of directions) {
          let cellsToMark = this.checkCellsInDirection(me, x, y, dx, dy);
          for (let [i, j] of cellsToMark) {
              this.board[i][j] = this.getMySymbol(me);
              this.incrementMyScore(me);
          }
      }
  }

  markWithPlayerNumOld(me, x, y) {
    this.board[x][y] = this.getMySymbol(me);
    for (let i = x - 1; i >= 0; i--) {
      if (this.board[i][y] == SYMBOL_EMPTY) break;
      if (this.board[i][y] == this.getMySymbol(me)) {
        for (let j = x - 1; j > i; j--) {
          if (this.board[j][y] == this.getOpponentSymbol(me)) {
            this.board[j][y] = this.getMySymbol(me);
            this.incrementMyScore(me);
          }
        }
        break;
      }
    }
    for (let i = x + 1; i < 10; i++) {
      if (this.board[i][y] == SYMBOL_EMPTY) break;
      if (this.board[i][y] == this.getMySymbol(me)) {
        for (let j = x + 1; j < i; j++) {
          if (this.board[j][y] == this.getOpponentSymbol(me)) {
            this.board[j][y] = this.getMySymbol(me);
            this.incrementMyScore(me);
          }
        }
        break;
      }
    }
    for (let i = y - 1; i >= 0; i--) {
      if (this.board[x][i] == SYMBOL_EMPTY) break;
      if (this.board[x][i] == this.getMySymbol(me)) {
        for (let j = y - 1; j > i; j--) {
          if (this.board[x][j] == this.getOpponentSymbol(me)) {
            this.board[x][j] = this.getMySymbol(me);
            this.incrementMyScore(me);
          }
        }
        break;
      }
    }
    for (let i = y + 1; i < 10; i++) {
      if (this.board[x][i] == SYMBOL_EMPTY) break;
      if (this.board[x][i] == this.getMySymbol(me)) {
        for (let j = y + 1; j < i; j++) {
          if (this.board[x][j] == this.getOpponentSymbol(me)) {
            this.board[x][j] = this.getMySymbol(me);
            this.incrementMyScore(me);
          }
        }
        break;
      }
    }
  }

}

exports.Board = Board;