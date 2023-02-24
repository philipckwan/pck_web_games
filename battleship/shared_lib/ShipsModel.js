import {timeLog} from "./PCKUtils.js"

const SHIP_CARRIER = "carrier";
const SHIP_BATTLESHIP = "battleship";
const SHIP_CRUISER = "cruiser";
const SHIP_SUBMARINE = "submarine";
const SHIP_DESTROYER = "destroyer";

export class ShipsModel {
  ships = undefined;
  /**
    {
     "carrier" -> {"10", "11", "12", "13", "14"}
     "battleship" -> {"35", "45", "55", "65"}
     ...
    }
  */ 

  constructor() {
    this.ships = new Map();
  }

  placeShips(placementsStr) {
    // Assume the placementsStr in this format: 1:3;5:3;4:7;4:4;2:5;2:7;0:0;2:0;4:1;5:1;
    const shipsStartEnd = placementsStr.split(";");
    //timeLog(`__shipsStartEnd.length:${shipsStartEnd.length};`)
    for (let i = 0; i < shipsStartEnd.length - 1; i = i + 2) {
      //timeLog(`__shipsStartEnd[i]:${shipsStartEnd[i]}; shipsStartEnd[i+1]:${shipsStartEnd[i+1]};`)
      // shipsStartEnd[0] = "1:3"
      const shipStartPosition = shipsStartEnd[i].split(":");
      const shipEndPosition = shipsStartEnd[i+1].split(":");
      
      // shipStartPosition = [1,3]
      let aShipFullPositions = this.generateFullPositions(shipStartPosition, shipEndPosition);
      switch (i) {
        case 0:
          this.ships.set(SHIP_CARRIER, new Set(aShipFullPositions));
          break;
        case 2:
          this.ships.set(SHIP_BATTLESHIP, new Set(aShipFullPositions));
          break;
        case 4:
          this.ships.set(SHIP_CRUISER, new Set(aShipFullPositions));
          break;    
        case 6:
          this.ships.set(SHIP_SUBMARINE, new Set(aShipFullPositions));
          break;                  
        case 8:
          this.ships.set(SHIP_DESTROYER, new Set(aShipFullPositions));
          break;   
      }
    }
  }

  /**
   * Given a startPosition and endPosition, assuming it is either horizontal or vertical (but not diagonal),
   * returns a list of positions that span from one end to another end.
   * Does not guarantee that the startPosition is in the beginning of the list
   * @param {[x1,y1]} startPosition 
   * @param {[x2,y2]} endPosition 
   */
  generateFullPositions(startPosition, endPosition) {
    let fullPositions = [];
    if (startPosition[0] == endPosition[0]) {
      if (startPosition[1] < endPosition[1]) {
        for (let j = startPosition[1]; j <= endPosition[1]; j++) {
          fullPositions.push(`${startPosition[0]}${j}`);
        }
      } else {
        for (let j = endPosition[1]; j <= startPosition[1]; j++) {
          fullPositions.push(`${startPosition[0]}${j}`);
        }
      }
    } else {
      if (startPosition[0] < endPosition[0]) {
        for (let j = startPosition[0]; j <= endPosition[0]; j++) {
          fullPositions.push(`${j}${startPosition[1]}`);
        }
      } else {
        for (let j = endPosition[0]; j <= startPosition[0]; j++) {
          fullPositions.push(`${j}${startPosition[1]}`);
        }
      }
    }
    return fullPositions;
  }

  attack(row, col) {
    let colLetter = String.fromCharCode('A'.charCodeAt() + col); 
    let results = [];
    for (let aShip of this.ships.keys()) {
      let unHitPositions = this.ships.get(aShip);
      let attackRowCol = `${row}${col}`;
      if (this.ships.get(aShip).delete(attackRowCol)) {
        timeLog(`ShipsModel.attack: ship [${aShip}] is hit at [${row},${colLetter}];`);
        return [true, `ship [${aShip}] is hit at [${row},${colLetter}];`];
      }
    }
    return [false, `attack missed at [${row},${colLetter}];`];
  }
}