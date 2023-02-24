import {timeLog} from "./PCKUtils.js"
import {PlayerModel} from "./PlayerModel.js"
import {ShipsModel} from "./ShipsModel.js"

const SYMBOL_EMPTY = '';
const SYMBOL_HIT = 'O';
const SYMBOL_MISSED = 'X';
const SYMBOL_PLACED = '.';

export class BoardModel {
  player = undefined;
  board = undefined;
  placementDone = false;
  ships = undefined;
  
  constructor() {
    this.player = new PlayerModel();
    this.board = Array(10).fill(0).map(row => new Array(10).fill(SYMBOL_EMPTY));
    this.placementDone = false;
  }

  recordPlacements(placements) {
    timeLog(`BoardModel.recordPlacements: playerName:${this.player.name}; placements:${placements};`);
    this.ships = new ShipsModel();
    this.ships.placeShips(placements);
    // TODO: hacky, not the best way to handle, but do this for now
    let allShipsPlacements = this.ships.ships;
    for (let aShip of allShipsPlacements.keys()) {
      let aShipPlacements = allShipsPlacements.get(aShip);
      for (let aShipPlacement of aShipPlacements.values()) {
        this.board[parseInt(aShipPlacement.substring(0,1))][parseInt(aShipPlacement.substring(1,2))] = SYMBOL_PLACED;
      }
    }
    this.placementDone = true;
  }

  attack(row, col) {
    let [isHit, message] = this.ships.attack(row, col);
    this.board[row][col] = isHit ? SYMBOL_HIT : SYMBOL_MISSED;
    return [isHit, message];
  }

}