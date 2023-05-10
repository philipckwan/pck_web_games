import {timeLog} from "./PCKUtils.js"
import {PlayerModel} from "./PlayerModel.js"
//import {ShipsModel} from "./ShipsModel.js"

export const SYMBOL_EMPTY = '';
export const SYMBOL_HIT = 'O';
export const SYMBOL_MISSED = 'X';

const SYMBOL_CARRIER = 'C';
const SYMBOL_BATTLESHIP = 'B';
const SYMBOL_CRUISER = 'R';
const SYMBOL_SUBMARINE = 'S';
const SYMBOL_DESTROYER = 'D';
export const ARRAY_SHIP_SYMBOLS = [SYMBOL_CARRIER, SYMBOL_BATTLESHIP, SYMBOL_CRUISER, SYMBOL_SUBMARINE, SYMBOL_DESTROYER]; 
const NAME_CARRIER = "Carrier";
const NAME_BATTLESHIP = "Battleship";
const NAME_CRUISER = "Cruiser";
const NAME_SUBMARINE = "Submarine";
const NAME_DESTROYER =  "Destroyer";
const INITIAL_HP_CARRIER = 5;
const INITIAL_HP_BATTLESHIP = 4;
const INITIAL_HP_CRUISER = 3;
const INITIAL_HP_SUBMARINE = 3;
const INITIAL_HP_DESTROYER = 2;

export class BoardModel {
  player = undefined;
  board = undefined;
  placementDone = false;
  shipsSymbolToName = new Map();
  shipsSymbolToHP = new Map();
  numShipAlive = 5;
  //ships = undefined;
  
  constructor() {
    this.player = new PlayerModel();
    this.board = Array(10).fill(0).map(row => new Array(10).fill(SYMBOL_EMPTY));
    this.placementDone = false;
    this.shipsSymbolToName.set(SYMBOL_CARRIER, NAME_CARRIER);
    this.shipsSymbolToName.set(SYMBOL_BATTLESHIP, NAME_BATTLESHIP);
    this.shipsSymbolToName.set(SYMBOL_CRUISER, NAME_CRUISER);
    this.shipsSymbolToName.set(SYMBOL_SUBMARINE, NAME_SUBMARINE);
    this.shipsSymbolToName.set(SYMBOL_DESTROYER, NAME_DESTROYER);

    this.shipsSymbolToHP.set(SYMBOL_CARRIER, INITIAL_HP_CARRIER);
    this.shipsSymbolToHP.set(SYMBOL_BATTLESHIP, INITIAL_HP_BATTLESHIP);
    this.shipsSymbolToHP.set(SYMBOL_CRUISER, INITIAL_HP_CRUISER);
    this.shipsSymbolToHP.set(SYMBOL_SUBMARINE, INITIAL_HP_SUBMARINE);
    this.shipsSymbolToHP.set(SYMBOL_DESTROYER, INITIAL_HP_DESTROYER);
  }

    /**
   * Given a startPosition and endPosition, assuming it is either horizontal or vertical (but not diagonal),
   * mark the list of positions that span from one end to another end.
   * @param {[x1,y1]} startPosition 
   * @param {[x2,y2]} endPosition 
   */
  markFullPositions(startPosition, endPosition, shipSymbol) {
    if (startPosition[0] == endPosition[0]) {
      let rowFixed = startPosition[0];
      let [colStart, colEnd] = startPosition[1] < endPosition[1] ? [startPosition[1], endPosition[1]] : [endPosition[1], startPosition[1]];
      for (let j = colStart; j <= colEnd; j++) {
        this.board[rowFixed][j] = `${shipSymbol}${j-colStart}H`;
      }
      /*
      if (startPosition[1] < endPosition[1]) {
        for (let j = startPosition[1]; j <= endPosition[1]; j++) {
          this.board[startPosition[0]][j] = shipSymbol;
        }
      } else {
        for (let j = endPosition[1]; j <= startPosition[1]; j++) {
          this.board[startPosition[0]][j] = shipSymbol;
        }
      }
      */
    } else {
      let colFixed = startPosition[1];
      let [rowStart, rowEnd] = startPosition[0] < endPosition[0] ? [startPosition[0], endPosition[0]] : [endPosition[0], startPosition[0]];
      for (let j = rowStart; j <= rowEnd; j++) {
        this.board[j][colFixed] = `${shipSymbol}${j-rowStart}V`;
      }
      /*
      if (startPosition[0] < endPosition[0]) {
        for (let j = startPosition[0]; j <= endPosition[0]; j++) {
          this.board[j][startPosition[1]] = shipSymbol;
        }
      } else {
        for (let j = endPosition[0]; j <= startPosition[0]; j++) {
          this.board[j][startPosition[1]] = shipSymbol;
        }
      }
      */
    }
  }

  recordPlacements(placementsStr) {
    // Assume the placementsStr in this format: 1:3;5:3;4:7;4:4;2:5;2:7;0:0;2:0;4:1;5:1;
    timeLog(`BoardModel.recordPlacements: playerName:${this.player.name}; placementsStr:${placementsStr};`);
    const shipsStartEnd = placementsStr.split(';');
    for (let i = 0; i < shipsStartEnd.length - 1; i = i + 2) {
      const shipStartPosition = shipsStartEnd[i].split(":");
      const shipEndPosition = shipsStartEnd[i+1].split(":");
      
      // shipStartPosition = [1,3]
      //let aShipFullPositions = this.generateFullPositions(shipStartPosition, shipEndPosition);
      switch (i) {
        case 0:
          this.markFullPositions(shipStartPosition, shipEndPosition, SYMBOL_CARRIER);
          break;
        case 2:
          this.markFullPositions(shipStartPosition, shipEndPosition, SYMBOL_BATTLESHIP);
          break;
        case 4:
          this.markFullPositions(shipStartPosition, shipEndPosition, SYMBOL_CRUISER);
          break;    
        case 6:
          this.markFullPositions(shipStartPosition, shipEndPosition, SYMBOL_SUBMARINE);
          break;                  
        case 8:
          this.markFullPositions(shipStartPosition, shipEndPosition, SYMBOL_DESTROYER);
          break;   
      }
    }
    this.placementDone = true;
  }

  /**
   * 
   * @param {*} row 
   * @param {*} col 
   * @returns [isHit:boolean, message:string, isAllSunk:boolean]
   */
  attack(row, col) {
    let results = [];
    let colLetter = String.fromCharCode('A'.charCodeAt() + col); 

    let currentAttackSymbol = this.board[row][col];
    let currentAttackSymbolFirstChar = currentAttackSymbol.substring(0,1);
    timeLog(`BoardModel.attack: currentAttackSymbolFirstChar:${currentAttackSymbolFirstChar};`);
    if (this.shipsSymbolToName.get(currentAttackSymbolFirstChar) != undefined) {
      // it's a hit
      this.shipsSymbolToHP.set(currentAttackSymbolFirstChar,  this.shipsSymbolToHP.get(currentAttackSymbolFirstChar) - 1);
      if (this.shipsSymbolToHP.get(currentAttackSymbolFirstChar) === 0) {
        // this ship is hit, and is sunk
        this.numShipAlive = this.numShipAlive - 1;
        results = [true, `ship [${this.shipsSymbolToName.get(currentAttackSymbolFirstChar)}] is hit and sunk at [${row},${colLetter}];`, this.numShipAlive == 0];
      } else {
        // this ship is hit, but still alive
        results = [true, `ship [${this.shipsSymbolToName.get(currentAttackSymbolFirstChar)}] is hit at [${row},${colLetter}];`, false];
      }
      this.board[row][col] = SYMBOL_HIT;
    } else {
      // it's a miss
      results = [false, `attack missed at [${row},${colLetter}];`, false];
      this.board[row][col] = SYMBOL_MISSED;
    }
    return results;
  }

}