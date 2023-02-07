export function timeLog(msg) {
  let current = new Date();
  let currentTime  = current.toLocaleTimeString();
  console.log(`[${currentTime}]${msg}`);
}

export function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}</h2>
}

export async function fetchGame(gameID) {
  //timeLog(`PCKUtilsClient.fetchGame: gameID:${gameID};`);
  const response = await fetch(`/games/${gameID}`);
  const json = await response.json();
  //timeLog(`__json:${JSON.stringify(json)};`);
  let fetchedGame = json.game;
  return fetchedGame;
}

export async function sendMove(gameID, playerNum, x, y) {
  timeLog(`PCKUtilsClient.sendMove: [${gameID},${playerNum},${x},${y}];`);
  const response = await fetch(`/games/${gameID}`, {
    method: 'post',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
     "playerNum": playerNum,
     "x" : x,
     "y" : y,
    })
  });
  const json = await response.json();
  //timeLog(`__json:${JSON.stringify(json)};`);
}

export async function requestNewGame(playerName) {
  timeLog(`PCKUtilsClient.requestNewGame: 1.0;`);
  const response = await fetch(`/games`, {
    method: 'post',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
     "playerName": playerName,
    })
  });
  const json = await response.json();
  //timeLog(`__json:${JSON.stringify(json)};`);
  return json;
}

export async function requestJoinGame(playerName, gameID) {
  timeLog(`PCKUtilsClient.requestJoinGame: 1.0;`);
  const response = await fetch(`/games/${gameID}/join`, {
    method: 'post',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
     "playerName": playerName,
    })
  });
  const json = await response.json();
  //timeLog(`__json:${JSON.stringify(json)};`);
  return json;
}