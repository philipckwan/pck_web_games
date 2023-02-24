import {useEffect, useState} from "react";
import {timeLog} from "./shared_lib/PCKUtils"
import {GameFSM} from "./GameFSM";
import {ARRAY_SHIP_SYMBOLS} from "./shared_lib/BoardModel";

const ImageOneSquare = require("./images/one_square-30x30.jpg");
const SQUARE_SHIP_PLACED = '.';


const Square = ({ square, onClick }) => {
  return (
    <td
      className="square"
      style={{ width: "30px", height: "30px", backgroundImage: ARRAY_SHIP_SYMBOLS.includes(square) ? `url(${ImageOneSquare})` : "none", }}
      onClick={onClick}
    ><font color={square === 'X' ? "red" : square === 'O' ? "green" : "black"}>{ARRAY_SHIP_SYMBOLS.includes(square) ? '' : square}</font>
    </td>
  );
};

const OppSquare = ({ square, onClick }) => {
  return (
    <td
      className="square"
      style={{ width: "30px", height: "30px"}}
      onClick={onClick}
    ><font color={square === 'X' ? "red" : square === 'O' ? "green" : "black"}>{ARRAY_SHIP_SYMBOLS.includes(square) ? '' : square}</font>    
    </td>
  );
};

export function GameBS (props) {

  const [myBoard, setMyBoard] = useState([    
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
  const [oppBoard, setOppBoard] = useState([    
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
  const [myName, setMyName] = useState("n/a");
  const [oppName, setOppName] = useState("n/a");
  const [gameMessage, setGameMessage] = useState("-");
  const [gameStateID, setGameStateID] = useState("start");
  const [firstPos, setFirstPos] = useState([0,0]);
  const [pollGame, setPollGame] = useState(false);
  const [refreshIntervalID, setRefreshIntervalID] = useState(0);
  const [myPlacements, setMyPlacements] = useState("");

  const appState = props.appActive;
  const gameID = props.gameID;
  const playerNum = props.playerNum;

  useEffect(() => {
    if (!appState) {
      let currentState = GameFSM[gameStateID];
      let currentPoll = currentState.poll;
      timeLog(`GameBS.useEffect[appState, gameStateID]: gameStateID:${gameStateID}, currentPoll:${currentPoll};`);
      setPollGame(currentPoll);
      if (gameStateID === "destroyerEndPlaced") {
        timeLog(`GameBS.useEffect[appState, gameStateID]: will send placements to server`);
        sendPlacements();
      }
    }
  }, [appState, gameStateID]);

  useEffect(() => {
    //timeLog(`useEffect.pollGame: pollGame:${pollGame};`);
    if (pollGame) {
      setRefreshIntervalID(setInterval(refreshGame, 1000));
    } else {
      clearInterval(refreshIntervalID);
    }
  }, [pollGame]);

  async function sendPlacements() {
    timeLog(`GameBS.sendPlacements: playerNum:${playerNum}, myPlacements:${myPlacements};`);
    const response = await fetch(`/games/${gameID}/placements`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
       "playerNum": playerNum,
       "placements": myPlacements,
      })
    });
  }

  async function refreshGame() {
    if (gameID == "") {
      timeLog(`GameBS.refreshGame: gameID is null;`);
      return;
    } else {
      //timeLog(`GameBS.refreshGame: gameID: ${gameID};`);
    }
    //let theGame = await fetchGame(gameIDInput);
    
    const response = await fetch(`/games/${gameID}/${playerNum}`);
    const json = await response.json();
    let theGame = json.game;
    let nextStateID = theGame.state;
    if (nextStateID === "player1Turn" || nextStateID === "player2Turn") {
      if ((playerNum === 1 && nextStateID === "player1Turn") || (playerNum === 2 && nextStateID === "player2Turn")) {
        nextStateID = "thisPlayerTurn";
        setGameMessage("-");
      } else {
        nextStateID = "otherPlayerTurn";
      }
    }
    if (nextStateID === "player1Win" || nextStateID === "player2Win") {
      if ((playerNum === 1 && nextStateID === "player1Win") || (playerNum === 2 && nextStateID === "player2Win")) {
        nextStateID = "thisPlayerWin";
        setGameMessage("-");
      } else {
        nextStateID = "thisPlayerLose";
      }
    }
    setMyName(playerNum === 1 ? theGame.board1.player.name : theGame.board2.player.name);
    setMyBoard(playerNum === 1 ? theGame.board1.board : theGame.board2.board);
    setOppName(playerNum === 1 ? theGame.board2.player.name : theGame.board1.player.name);
    setOppBoard(playerNum === 1 ? theGame.board2.board : theGame.board1.board);
    setGameStateID(nextStateID);
    let nextStatePoll = GameFSM[nextStateID].poll;
    timeLog(`GameBS.refreshGame: nextStateID:${nextStateID}; nextStatePoll:${nextStatePoll};`);
    setPollGame(nextStatePoll);
  }

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
    timeLog(`GameBS.placeEndOfShip: startPosition:${startPosition};`);
    let endPosition = [];
    let dx = normalize(direction[0]);
    let dy = normalize(direction[1]);
    let i = startPosition[0] + dx;
    let j = startPosition[1] + dy;
    const boardClone = JSON.parse(JSON.stringify(myBoard));
    let numPlaced = 1;
    while (i >= 0 && i < 10 && j >= 0 && j < 10 && numPlaced < length) {
      if (boardClone[i][j] == SQUARE_SHIP_PLACED) {
        setGameMessage("ERROR - invalid placement as a square is already occupied");
        return false;
      }
      boardClone[i][j] = SQUARE_SHIP_PLACED;
      endPosition = [i, j];
      i += dx;
      j += dy;
      numPlaced += 1;
    }
    if (numPlaced < length) {
      setGameMessage("ERROR - invalid placement as the ship is going out of bounds");
      return false;
    }
    setMyBoard(boardClone);
    //timeLog(`__myPlacements:${myPlacements};`);
    setMyPlacements(`${myPlacements}${endPosition[0]}:${endPosition[1]};`);
    return true;
  }

  const handlePlacementClick = (rowIndex, colIndex) => {
    timeLog(`GameBS.handlePlacementClick: [${rowIndex},${colIndex}];`)
    let currentState = GameFSM[gameStateID];
    timeLog(`GameBS.handlePlacementClick: currentState:${gameStateID};`);
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

  async function handleAttackClick (rowIndex, colIndex) {
    timeLog(`GameBS.handleAttackClick: [${rowIndex},${colIndex}];`)
    if (gameStateID != "thisPlayerTurn") {
      setGameMessage("ERROR - You cannot make an attack as it is not your turn yet.");
      return;
    }
    if (oppBoard[rowIndex][colIndex] === 'X'  || oppBoard[rowIndex][colIndex] === 'O') {
      setGameMessage("ERROR - You cannot make an attack on a square that you have already attacked before.");
      return;
    }
    timeLog(`GameBS.handleAttackClick: gameStateID:${gameStateID};`);
    const response = await fetch(`/games/${gameID}/attack`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
       "playerNum": playerNum,
       "row": rowIndex,
       "col": colIndex,
      })
    });
    const json = await response.json();
    //timeLog(`__json:${JSON.stringify(json)};`);
    let isHit = json.isHit;
    let message = json.message;
    setGameMessage(message);
    refreshGame();
    //let theGame = json.game;
  }

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
        <table className="gamePanelTable">
          <tbody>
            <tr>
              <td>My Board [{myName}]</td>
              <td>Opponent Board  [{oppName}]</td>
            </tr>
            <tr>
              <td>
                <table className="myTable">
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
                    {myBoard.map((row, i) => (
                      <tr key={i}>
                        <td className="number-header">{i}</td>
                        {row.map((col, j) => (
                          <Square
                            square={col}
                            onClick={() => handlePlacementClick(i, j)}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td>
              <table className="myTable">
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
                    {oppBoard.map((row, i) => (
                      <tr key={i}>
                        <td className="number-header">{i}</td>
                        {row.map((col, j) => (
                          <OppSquare
                            square={col}
                            onClick={() => handleAttackClick(i, j)}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}