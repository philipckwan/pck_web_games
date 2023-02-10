import React, { useState } from "react";
import "./AppBattleship.css";

const ImageOneSquare = require("./images/one_square-30x30.jpg");

const MSG1="n/a";
const MSG2="start position placed, please place the end";
const MSG3="end position placed"
const MSG4="invalid end position"

const GAME_STATE = ["start", "carrierStartPlaced", "carrierEndPlaced", "battleshipStartPlaced", "battleshipEndPlaced"];

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

const AppBattleShip = () => {
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
  const [gameState, setGameState] = useState(GAME_STATE[0]);
  const [message, setMessage] = useState(MSG1);
  const [msgFirstPos, setMsgFirstPos] = useState("n/a");
  const [firstPos, setFirstPos] = useState([0,0]);

  const handleSquareClick = (rowIndex, colIndex) => {
    const updatedBoard = [...board];
    if (gameState == GAME_STATE[0]) {
      setFirstPos([rowIndex, colIndex]);
      setMessage(MSG2);
      setGameState(GAME_STATE[1]);
      setMsgFirstPos(`row:${rowIndex}; col:${colIndex};`);
      updatedBoard[rowIndex][colIndex] = "A";
    }
    else if (gameState == GAME_STATE[1] || gameState == GAME_STATE[3]) {
      if (firstPos[0] == rowIndex && firstPos[1] == colIndex) {
        setMessage("cannot put end on same square as start");
        return;
      }
      if (firstPos[0] != rowIndex && firstPos[1] != colIndex) {
        setMessage("invalid end position, row and col both not same as start");
        return;
      }
      if (firstPos[0] == rowIndex) {
        // changes in the col
        if (firstPos[1] < colIndex) {
          // goes right
          for (let i = firstPos[1] + 1; i <= colIndex; i++) {
            updatedBoard[rowIndex][i] = "A";
          }
        } else {
          // goes left
          for (let i = firstPos[1] - 1; i >= colIndex; i--) {
            updatedBoard[rowIndex][i] = "A";
          }
        }
      }
      if (firstPos[1] == colIndex) {
        // changes in the row
        if (firstPos[0] < rowIndex) {
          // goes down
          for (let i = firstPos[0] + 1; i <= rowIndex; i++) {
            updatedBoard[i][colIndex] = "A";
          }
        } else {
          // goes up
          for (let i = firstPos[0] - 1; i >= rowIndex; i--) {
            updatedBoard[i][colIndex] = "A";
          }
        }
      }
      setMessage(MSG3);
    }
    
    
    setBoard(updatedBoard);
  };

  return (
    <div>
      <div>
        <table>
          <tbody>
            <tr>
              <td style={{ width: "100px"}}>message</td>
              <td style={{ width: "500px"}}>{message}</td>
            </tr>
            <tr>
              <td>msgFirstPos</td>
              <td>{msgFirstPos}</td>
            </tr>
            <tr>
              <td>gameState</td>
              <td>{gameState}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="AppBattleShip">
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
    </div>
  );
};

export default AppBattleShip;
