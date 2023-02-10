import React, { useState } from "react";
import "./AppBattleship.css";

import {timeLog, playerNameCheck} from './shared_lib/PCKUtilsClient'
import {Game} from './Game'
import {GameModel} from "./shared_lib/GameModel";


const APP_VERSION = "v0.2";
const APP_TO_GAME_CONTEXT = {
  status: "game not started",
  gameID: 0,
  playerNumTurn: 0,
};
const PLAYER_NAME_LENGTH_MAX = 12;
const MSG1="-";
const MSG2="start position placed, please place the end";
const MSG3="end position placed"
const MSG4="invalid end position"


const AppBattleShip = () => {
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [gameIDInput, setGameIDInput] = useState("");
  const [game, setGame] = useState(APP_TO_GAME_CONTEXT);
  const [playerNum, setPlayerNum] = useState(0);
  const [pollGame, setPollGame] = useState(false);
  const [refreshIntervalID, setRefreshIntervalID] = useState(0);
  const [message, setMessage] = useState("input name to join a new game, or input name and game ID to join an existing game");
  const [messageColor, setMessageColor] = useState("black");

  function handlePlayerNameChange(event) {
    setPlayerNameInput(event.target.value);
    
  }

  function handleGameIDChange(event) {
    setGameIDInput(event.target.value);
  }


  async function handleStartNewGame() {
    let [checkPassed, checkMessage] = playerNameCheck(playerNameInput, PLAYER_NAME_LENGTH_MAX);
    setMessageColor("black");
    setMessage("proceed to start new game");
    if (!checkPassed) {
      setMessage(checkMessage);
      setMessageColor("red");
      return;
    }
    let respJson = await requestNewGame(playerNameInput);
    timeLog(`AppBattleship.handleStartNewGame: respJson:${respJson};`);
    setGameIDInput(respJson.gameID);
    setPlayerNum(1);
    //setPollGame(true);
    //setVersion(version+1);
    //refreshGame();
    //removeInputRows();
    setMessage("A new game is created, waiting for player 2 to join");
  }

  async function requestNewGame(playerName) {
    timeLog(`AppBattleship..requestNewGame: 1.0;`);
    let newGame = new GameModel(Math.floor(Math.random() * (99 - 1) + 1));
    return newGame;
    //newGame.setPlayerName(1, playerName);

    //let respJson = await requestNewGame(playerNameInput);
    //setGameIDInput(newGame.gameID);
    //setPlayerNum(1);
    //setPollGame(true);
    //setVersion(version+1);
    //refreshGame();
    //removeInputRows();
    //setMessage("A new game is created, waiting for player 2 to join");

  }

  async function handleJoinGame() {
    // TBC
  }

  async function handleWatchGame() {
    // TBC
  }

  return (
    <>
      <div>
        <table className="myTable">
          <tbody>
          <tr>
            <td className="myTableNameTD">Battleship</td>
            <td className="myTableNameTD">{APP_VERSION}</td>
            <td className="myTableMessageTD"><font color={messageColor}>{message}</font></td>
          </tr>          
          <tr id="rowPlayerNameInput">
            <td>Your name</td>
            <td><input type="text" size="12" id="playerNameInput" name="playerNameInput" onChange={handlePlayerNameChange} value={playerNameInput} /></td>
            <td><button onClick={handleStartNewGame}>Start New Game</button></td>
          </tr>
          <tr id="rowGameIDInput">
            <td>Game ID</td>
            <td><input type="text" size="5" id="gameIDInput" name="gameIDInput" onChange={handleGameIDChange} value={gameIDInput} /></td>
            <td><button onClick={handleJoinGame}>Join Game</button><button onClick={handleWatchGame}>Watch Game</button></td>
          </tr>    
          </tbody>
        </table>  
      </div>
      {/**<Game game={game} playerNum={playerNum} callback={refreshGame}/>**/}
      <Game/>
    </>
  );
};

export default AppBattleShip;
