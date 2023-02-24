import {timeLog} from "./PCKUtils.js"
import {BoardModel} from "./BoardModel.js"

const SQUARE_EMPTY = '';

export const GAME_STATE_NEW = "gameNotCreated";
export const GAME_STATE_CREATED = "gameCreated";
export const GAME_STATE_PLAYER_1_JOINED = "player1Joined";
export const GAME_STATE_START_PLACEMENTS = "startPlacement";
export const GAME_STATE_1_PLACEMENT_RECEIVED = "OnePlacementReceived";
export const GAME_STATE_PLAYER_1_TURN = "player1Turn";
export const GAME_STATE_PLAYER_2_TURN = "player2Turn";
export const GAME_STATE_PLAYER_1_WIN = "player1Win";
export const GAME_STATE_PLAYER_2_WIN = "player2Win";

export class GameModel {

  gameID = 0;
  state = GAME_STATE_NEW;
  board1 = undefined;
  board2 = undefined;

  constructor(_gameID) {
    this.gameID = _gameID;
    this.state = GAME_STATE_CREATED;
    this.board1 = new BoardModel();
    this.board2 = new BoardModel();
  }

  setPlayerName(playerNum, playerName) {
    timeLog(`GameModel.setPlayerName: playerNum:${playerNum}, playerName:${playerName};`)
    if (parseInt(playerNum) == 1) {
      this.board1.player.name = playerName;
      this.state = GAME_STATE_PLAYER_1_JOINED;
    } else {
      this.board2.player.name = playerName;
      this.state = GAME_STATE_START_PLACEMENTS;
    }
  }

  setPlacements(playerNum, placements) {
    timeLog(`GameModel.setPlacements: playerNum:${playerNum}, placements:${placements};`);
    if (parseInt(playerNum) == 1) {
      this.board1.recordPlacements(placements);
    } else {
      this.board2.recordPlacements(placements);
    }
    if (this.board1.placementDone && this.board2.placementDone) {
      this.state = GAME_STATE_PLAYER_1_TURN;
    } else {
      this.state = GAME_STATE_1_PLACEMENT_RECEIVED;
    }
  }

  attack(playerNum, row, col) {
    timeLog(`GameModel.attack: playerNum:${playerNum}, [${row},${col}];`);
    let results = [];
    if (parseInt(playerNum) == 1) {
      results = this.board2.attack(row, col);
    } else {
      results = this.board1.attack(row, col);
    }
    timeLog(`GameModel.attack: playerNum:${playerNum}, isHit:${results[0]}; message:${results[1]};`);

    // check if game is finished
    // hacky, not the best way
    let allShipsPlacementsBoard1 = this.board1.ships.ships;
    let board1StillAlive = false;
    for (let aShip of allShipsPlacementsBoard1.keys()) {
      let unHitPositions = allShipsPlacementsBoard1.get(aShip);
      if (unHitPositions.size > 0) {
        board1StillAlive = true;
        break;
      }
    }
    if (!board1StillAlive) {
      this.state = GAME_STATE_PLAYER_2_WIN;
      return results;
    }

    let allShipsPlacementsBoard2 = this.board2.ships.ships;
    let board2StillAlive = false;
    for (let aShip of allShipsPlacementsBoard2.keys()) {
      let unHitPositions = allShipsPlacementsBoard2.get(aShip);
      if (unHitPositions.size > 0) {
        board2StillAlive = true;
        break;
      }
    }
    if (!board2StillAlive) {
      this.state = GAME_STATE_PLAYER_1_WIN;
      return results;
    }
    

    // switch player turn
    this.state = this.state == GAME_STATE_PLAYER_1_TURN ? GAME_STATE_PLAYER_2_TURN : GAME_STATE_PLAYER_1_TURN;

    return results;
  }

}
