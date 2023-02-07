import './App.css';
import {timeLog, fetchGame, requestNewGame, requestJoinGame} from './PCKUtilsClient'
import React, {useEffect, useState} from 'react'
//import ReactDOM from 'react-dom/client';
import {Game} from './Game'

const APP_VERSION = "v2.0";
const APP_TO_GAME_CONTEXT = {
  status: "game not started",
  gameID: 0,
  playerNumTurn: 0,
};
const PLAYER_NAME_LENGTH_MAX = 12;

function App() {
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [gameIDInput, setGameIDInput] = useState("");
  const [game, setGame] = useState(APP_TO_GAME_CONTEXT);
  const [playerNum, setPlayerNum] = useState(0);
  const [pollGame, setPollGame] = useState(false);
  const [refreshIntervalID, setRefreshIntervalID] = useState(0);
  const [message, setMessage] = useState("input name to join a new game, or input name and game ID to join an existing game");
  const [messageColor, setMessageColor] = useState("black");

  /*
  useEffect(() => {
    refreshGame();
  }, [version]);
  */

  useEffect(() => {
    //timeLog(`useEffect.pollGame: pollGame:${pollGame};`);
    if (pollGame) {
      setRefreshIntervalID(setInterval(refreshGame, 1000));
    } else {
      clearInterval(refreshIntervalID);
    }
  }, [pollGame]);

  function handlePlayerNameChange(event) {
    setPlayerNameInput(event.target.value);
  }

  function handleGameIDChange(event) {
    setGameIDInput(event.target.value);
  }

  function removeInputRows() {
    document.getElementById("rowPlayerNameInput").remove();
    document.getElementById("rowGameIDInput").remove();
  }

  function playerNameCheck() {
    let checkPassed = true;
    setMessageColor("black");
    if (playerNameInput == "") {
      setMessage("ERROR - cannot start or join game with empty player name");
      setMessageColor("red");
      checkPassed = false;
    }
    if (playerNameInput.length > PLAYER_NAME_LENGTH_MAX) {
      setMessage(`ERROR - name is too long, please shorten it to no more than ${PLAYER_NAME_LENGTH_MAX} characters`);
      setMessageColor("red");
      checkPassed = false;
    }
    return checkPassed;
  }

  async function handleStartNewGame() {
    if (!playerNameCheck()) return;
    let respJson = await requestNewGame(playerNameInput);
    setGameIDInput(respJson.gameID);
    setPlayerNum(1);
    setPollGame(true);
    //setVersion(version+1);
    //refreshGame();
    removeInputRows();
    setMessage("A new game is created, waiting for player 2 to join");
  }

  async function handleJoinGame() {
    if (!playerNameCheck()) return;
    if (gameIDInput == "") {
      setMessage("ERROR - cannot join game with empty game ID");
      return;
    }
    let respJson = await requestJoinGame(playerNameInput, gameIDInput);
    timeLog(`__respJson.results:${respJson.results};`);
    if (respJson.results != "OK") {
      setMessage(respJson.results);
    } else {
      removeInputRows();
      setPlayerNum(2);
      //setVersion(version+1);
      setPollGame(true);
    }
  }

  async function handleWatchGame() {
    if (gameIDInput == "") {
      setMessage("ERROR - cannot watch game with empty game ID");
      return;
    }
    removeInputRows();
    setPlayerNum(3);
    setPollGame(true);
  }

  async function refreshGame() {
    //timeLog(`App.refreshGame: 1.0`);
    if (gameIDInput == "") {
      return;
    }
    let theGame = await fetchGame(gameIDInput);
    if (playerNum == 3 || theGame.playerNumTurn != playerNum) {
      setPollGame(true);
    } else {
      setPollGame(false);
    }
    //timeLog(`App.refreshGame: calling setGame with playerNumTurn:${theGame.playerNumTurn};`)
    setGame(theGame);
  }

  return (
    <div className="App">
      <div>
        <table className="myTable">
          <tbody>
          <tr>
            <td>BS</td>
            <td>{APP_VERSION}</td>
            <td><font color={messageColor}>{message}</font></td>
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
      <Game game={game} playerNum={playerNum} callback={refreshGame}/>
    </div>
  );
}

export default App;
