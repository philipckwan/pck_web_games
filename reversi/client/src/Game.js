import {useState} from "react";
import {timeLog, sendMove} from './PCKUtilsClient'
import {Board} from './Board'

const MESSAGE_PLAYER_TURN = "It is your turn now, please make a move.";
const MESSAGE_NOT_PLAYER_TURN = "You cannot make a move as it is not your turn yet.";
const MESSAGE_PLAYER_MOVED = "You have made a move, will wait for your opponent's turn.";
const MESSAGE_ALREADY_OCCUPIED = "You cannot make a move here as it is already occupied.";
const MESSAGE_WATCHER_CANNOT_MOVE = "You cannot make a move as you are just a watcher.";

export function Game (props) {
  //let game = props.game;
  //timeLog(`Game: game:${JSON.stringify(game)};`);
  //const [status, setStatus] = useState("Initializing");
  //const [playerBoard, setPlayerBoard] = useState(Array(10).fill(0).map(row => new Array(10).fill('')));
  //const INIT_BOARD = Array(10).fill(0).map(row => new Array(10).fill(''));
  //const [player2Board, setPlayer2Board] = useState(Array(10).fill(0).map(row => new Array(10).fill('')));
  const [localMessage, setLocalMessage] = useState("-");
  /*
  if (props.game.playerNumTurn != 0 && props.game.playerNumTurn == props.playerNum && localMessage != MESSAGE_PLAYER_TURN) {
    timeLog(`Game: props.game.playerNumTurn:${props.game.playerNumTurn}; props.playerNum:${props.playerNum};`);
    setLocalMessage(MESSAGE_PLAYER_TURN);
  }
  */


  async function handleClick(row, col) {
    //timeLog(`Game.handleClick: player[${player}]; [${row}:${col}];`)
    if (props.playerNum == 3) {
      setLocalMessage(MESSAGE_WATCHER_CANNOT_MOVE);
      return;
    }
    if (props.playerNum != props.game.playerNumTurn) {
      setLocalMessage(MESSAGE_NOT_PLAYER_TURN);
      return;
    }
    let marking = props.game.board.board[row][col];
    //timeLog(`__marking:${marking};`)
    if (marking != "") {
      setLocalMessage(MESSAGE_ALREADY_OCCUPIED);
      return;
    }

    sendMove(props.game.gameID, props.playerNum, row, col);
    //timeLog(`__setting message to ${MESSAGE_PLAYER_MOVED};`)
    setLocalMessage(MESSAGE_PLAYER_MOVED);
    await props.callback();
  }

  return (
    <>
      <div>
        <table className="myTable">
          <tbody>       
          <tr>
            <td>Game Status</td>
            <td>{props.game.status}</td>
          </tr>     
          <tr>
            <td>Game ID</td>
            <td>{props.game.gameID}</td>
          </tr>     
          <tr>
            <td>Player Num Turn</td>
            <td>{props.game.playerNumTurn}</td>
          </tr>   
          <tr>
            <td>Local Message</td>
            <td>{localMessage}</td>
          </tr>      
          </tbody>
        </table>  
      </div>
      <br />
      <div>
        <table className="myTable">
          <tbody>      
          <tr>
            <td><Board board={props.game.board} clickCallBack={handleClick} /></td>
            {/** 
            <td><Board player="1" name={props.game.player1 ? props.game.player1.playerName : ''} board={props.game.player1 ? props.game.player1.board : player1Board} clickCallBack={handleClick} /></td>
            <td><Board player="2" name={props.game.player2 ? props.game.player2.playerName : ''} board={props.game.player2 ? props.game.player2.board : player2Board} clickCallBack={handleClick} /></td>
            */}
          </tr>          
          </tbody>
        </table>
      </div>
    </>
  );
}