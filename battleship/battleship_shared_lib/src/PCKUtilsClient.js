export function timeLog(msg) {
  let current = new Date();
  let currentTime  = current.toLocaleTimeString();
  console.log(`v8-[${currentTime}]${msg}`);
}

export function playerNameCheck(playerName, maxLength) {
  let checkPassed = true;
  let message = "";
  //setMessageColor("black");
  if (playerName == "") {
    message = `ERROR - player name is empty`;
    //setMessageColor("red");
    checkPassed = false;
  }
  if (playerName.length > maxLength) {
    message = `ERROR - name is too long, please shorten it to no more than ${maxLength} characters`;
    //setMessageColor("red");
    checkPassed = false;
  }
  return [checkPassed, message];
}
/*
export function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}</h2>
}
*/
