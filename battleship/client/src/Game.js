import {useState} from "react";
import {timeLog} from "./common/PCKUtilsClient"
import {GameFSM} from "./GameFSM";

const ImageOneSquare = require("./images/one_square-30x30.jpg");

const Square = ({ square, onClick }) => {
  return (
    <td
      className="square"
      style={{ width: "30px", height: "30px", backgroundImage: square === "A" ? `url(${ImageOneSquare})` : "none", }}
      onClick={onClick}
    >    
    </td>
  );
};

export function Game (props) {

  const [board, setBoard] = useState([    
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""]
  ]);
  const [gameMessage, setGameMessage] = useState("-");
  const [gameStateID, setGameStateID] = useState("start");
  const [firstPos, setFirstPos] = useState([0,0]);


  const normalize = (number) => {
    /* 
      given number = -8, return -1
      given number = 4, return 1
      given number = 0, return 0
     */
    return number == 0 ? 0 : number / Math.abs(number);
  }

  const placeEndOfShip = (startPosition, direction, length) => {
    // assume startPosition = [r,c]
    // assume direction = [0,1~9] || [0,-1~-9] || [-1~-9,0] || [1~9,0]
    timeLog(`Game.placeEndOfShip: startPosition:${startPosition};`);
    let dx = normalize(direction[0]);
    let dy = normalize(direction[1]);
    let i = startPosition[0] + dx;
    let j = startPosition[1] + dy;
    const boardClone = JSON.parse(JSON.stringify(board));
    let numPlaced = 1;
    while (i >= 0 && i < 10 && j >= 0 && j < 10 && numPlaced < length) {
      if (boardClone[i][j] == "A") {
        setGameMessage("ERROR - invalid placement as a square is already occupied");
        return false;
      }
      boardClone[i][j] = "A";
      i += dx;
      j += dy;
      numPlaced += 1;
    }
    if (numPlaced < length) {
      setGameMessage("ERROR - invalid placement as the ship is going out of bounds");
      return false;
    }
    setBoard(boardClone);
    return true;
  }

  const handleSquareClick = (rowIndex, colIndex) => {
    let currentState = GameFSM[gameStateID];
    //console.log(`handleSquareClick: _${currentStateObject.next.success};`);
    //const updatedBoard = [...board];
    if (currentState.length == 1) {
      //updateBoard([[rowIndex, colIndex]]);
      if (placeEndOfShip([rowIndex, colIndex], [0,0], 2)) {
        setFirstPos([rowIndex, colIndex]);
        let nextStateID = currentState.next.success;
        setGameMessage("-");
        setGameStateID(nextStateID);
      }
    }
    else if (currentState.length > 1) {
      let direction = [rowIndex - firstPos[0], colIndex - firstPos[1]];
      if (direction[0] != 0 && direction[1] != 0) {
        setGameMessage("ERROR - invalid end position, row and col both not same as start");
        return;
      }
      if (placeEndOfShip(firstPos, direction, currentState.length)) {
        let nextStateID = currentState.next.success;
        setGameMessage("-");
        setGameStateID(nextStateID);
      }
    }
    //setBoard(updatedBoard);
  };

  return (
    <>
      <div>
        <table className="myTable">
          <tbody>         
          <tr>
            <td>gameMessage</td>
            <td>{gameMessage}</td>
          </tr>     
          <tr>
            <td style={{ width: "100px"}}>gameStateMessage</td>
            <td style={{ width: "500px"}}>{GameFSM[gameStateID].message}</td>
          </tr> 
          </tbody>
        </table>  
      </div>
      <br />    
      <div className="gameBattleship">
        <table>
          <tbody>
            <tr>
              <td></td>
              <td className="letter-header">A</td>
              <td className="letter-header">B</td>
              <td className="letter-header">C</td>
              <td className="letter-header">D</td>
              <td className="letter-header">E</td>
              <td className="letter-header">F</td>
              <td className="letter-header">G</td>
              <td className="letter-header">H</td>
              <td className="letter-header">I</td>
              <td className="letter-header">J</td>
            </tr>
            {board.map((row, i) => (
              <tr key={i}>
                <td className="number-header">{i}</td>
                {row.map((col, j) => (
                  <Square
                    square={col}
                    onClick={() => handleSquareClick(i, j)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}