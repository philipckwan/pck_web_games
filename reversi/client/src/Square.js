import {useState} from "react";
import {timeLog} from './PCKUtilsClient'

export function Square (props) {
  //timeLog(`Square2: props.row:${props.row}; props.col:${props.col};`)
  //const [value, setValue] = useState('');

  return (
    <button 
      className="square" 
      onClick={() => props.clickCallBack(props.row, props.col)}
    >
    {props.val}
    </button>
  );
}