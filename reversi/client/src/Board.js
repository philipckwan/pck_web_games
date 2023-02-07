import {useState} from "react";
import {timeLog} from './PCKUtilsClient'
import {Square} from './Square'

export function Board (props) {
  let propsBoard = props.board;
  if (propsBoard == undefined) {
    propsBoard = {
      player1:{
        playerName:"n/a",
        playerScore:0,
      },
      player2:{
        playerName:"n/a",
        playerScore:0,
      },
      board:Array(10).fill(0).map(row => new Array(10).fill('')),
    };
  }
  //timeLog(`Board: propsBoard:${JSON.stringify(propsBoard)};`);
  return (
    <div>
      <div>
        <table className="myTable">
          <tbody>
            <tr>
              <td>Player 1 [{propsBoard.player1.playerName} : {propsBoard.player1.playerScore}] - Player 2 [{propsBoard.player2.playerName} : {propsBoard.player2.playerScore}] .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        {propsBoard.board.map((rows, rIdx) => {
          return (
            <div className="board-row" key={rIdx}>
              {rows.map((cols, cIdx) => {
                //timeLog(`__cols:${cols};`);
                return (<div key={`${cIdx}`}><Square row={rIdx} col={cIdx} val={cols} clickCallBack={props.clickCallBack} /></div>);
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}