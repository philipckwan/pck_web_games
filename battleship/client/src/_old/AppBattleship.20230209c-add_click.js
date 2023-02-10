import React, { useState } from "react";
import "./AppBattleship.css";

const AppBattleShip = () => {
  const [board, setBoard] = useState([    ["", "", "", "", "", "", "", "", "", ""],
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

  const handleSquareClick = (rowIndex, colIndex) => {
    const updatedBoard = [...board];
    updatedBoard[rowIndex][colIndex] = "A";
    setBoard(updatedBoard);
  };

  return (
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
                <td
                  key={j}
                  className="square"
                  onClick={() => handleSquareClick(i, j)}
                >
                  {col}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppBattleShip;
