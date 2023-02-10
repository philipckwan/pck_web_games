import React, { useState } from "react";

const chessPiece = require("./images/carrier.jpg");

const BoardSquare = ({ children, onClick, hasPiece }) => (
  <div
    style={{
      width: "34px",
      height: "34px",
      backgroundColor: "white",
      border: "1px solid black",
      display: "inline-block",
      textAlign: "center",
      verticalAlign: "middle",
      backgroundImage: hasPiece ? `url(${chessPiece})` : "none",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    }}
    onClick={onClick}
  >
    {children}
  </div>
);

const ChessBoard = () => {
  const [board, setBoard] = useState(Array(10).fill(Array(10).fill(false)));

  const handleSquareClick = (row, col) => {
    const newBoard = board.map((r, i) => r.map((c, j) => (i === row && j >= col && j < col + 5 ? true : c)));
    setBoard(newBoard);
  };

  return (
    <div style={{ width: "100%", height: "100%", border: "1px solid black" }}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((hasPiece, colIndex) => (
            <BoardSquare
              key={colIndex}
              hasPiece={hasPiece}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
