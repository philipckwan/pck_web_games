import React, {useState} from "react";
import "./AppBattleship.css";

import {timeLog, playerNameCheck} from "./shared_lib/PCKUtils"
import {GameBS} from './GameBS'


const APP_VERSION = "v1.1";
const PLAYER_NAME_LENGTH_MAX = 12;

const AppBattleship = () => {
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [gameIDInput, setGameIDInput] = useState("");
  const [playerNum, setPlayerNum] = useState(0);
  const [message, setMessage] = useState("input name to join a new game, or input name and game ID to join an existing game");
  const [messageColor, setMessageColor] = useState("black");
  const [appActive, setAppActive] = useState(true);

  function handlePlayerNameChange(event) {
    setPlayerNameInput(event.target.value);
  }

  function handleGameIDChange(event) {
    setGameIDInput(event.target.value);
  }

  function removeInputRowsAndShowGameInfo() {
    document.getElementById("rowPlayerNameInput").remove();//.style.display = "none";
    document.getElementById("rowGameIDInput").remove();//.style.display = "none";
    document.getElementById("rowGameIDFromServer").style.display = "table-row";
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
    const response = await fetch(`/games`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
       "playerName": playerNameInput,
      })
    });
    let respJson = await response.json();
    setGameIDInput(respJson.gameID);
    removeInputRowsAndShowGameInfo();
    setMessage("A new game is created, waiting for player 2 to join");
    setPlayerNum(1);
    setAppActive(false);
  }

  async function handleJoinGame() {
    let [checkPassed, checkMessage] = playerNameCheck(playerNameInput, PLAYER_NAME_LENGTH_MAX);
    setMessageColor("black");
    setMessage("proceed to join game");
    if (!checkPassed) {
      setMessage(checkMessage);
      setMessageColor("red");
      return;
    }
    if (gameIDInput == "") {
      setMessage("ERROR - cannot join game with empty game ID");
      setMessageColor("red");
      return;
    }
    const response = await fetch(`/games/${gameIDInput}/join`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
       "playerName": playerNameInput,
      })
    });
    let respJson = await response.json();
    if (respJson.results != "OK") {
      setMessage(respJson.results);
    } else {
      removeInputRowsAndShowGameInfo();
      setPlayerNum(2);
      setAppActive(false);
    }
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
          <tr id="rowGameIDFromServer">
            <td className="myTableNameTD">Game ID</td>
            <td className="myTableNameTD">{gameIDInput}</td>
            <td className="myTableMessageTD"></td>
          </tr>    
          </tbody>
        </table>  
      </div>
      <br />
      <div id="gamePanel">
        <GameBS appActive={appActive} gameID={gameIDInput} playerNum={playerNum} />
      </div>
    </>
  );
};

export default AppBattleship;
