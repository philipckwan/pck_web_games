import React, { useState } from "react";
import "./AppBattleship.css";

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

  return (
    <div className="AppBattleShip">
      <table>
        <thead>
          <tr>
            <th></th>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <th key={num}>{num}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {board.map((row, i) => (
            <tr key={i}>
              <th className="row-label">{String.fromCharCode(65 + i)}</th>
              {row.map((col, j) => (
                <td key={j} className="square"></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppBattleShip;
