import {timeLog} from "./shared_lib/PCKUtils.js";
import {GameModel} from "./shared_lib/GameModel.js"
//const {Game} = require("./Game");

const MAX_NUMBER_OF_GAMES = 100;

export class Context {
    games = new Map();
    status = "initial";
    isInited = false;

    constructor() {
        this.isInited = false;
    }

    static get Instance() {
        return this._instance || (this._instance = new this());
    }

    init() {
        if (this.isInited) {
            timeLog(`Context.init: WARN - already inited;`);
            return;
        }
        //console.log(`Context.init: from .env:     network:${process.env.USE_NETWORK}; local:${process.env.IS_LOCAL};`);
        //console.log(`Context.init: from argument: network:${networkOverride}; local: ${localOverride};`);
        this.isInited = true;
        timeLog(`Context.init: 2.0;`);
    }

    newGame(playerNameInput, gameIDInput = 0) {
        if (this.games.size >= MAX_NUMBER_OF_GAMES) {
            timeLog(`Context.newGame: ERROR - cannot create any more new games, its full already; number of games:${this.games.size};`);
            return null;
        }
        if (gameIDInput != 0) {
            if (this.games.has(gameIDInput)) {
                timeLog(`Context.newGame: ERROR gameIDInput clash with existing game; gameIDInput:${gameIDInput};`);
                return null;
            }
        }
        let gameIDClash = false;
        let newGameID = -1;
        do {
            newGameID = (gameIDInput != 0) ? gameIDInput : Math.floor(Math.random() * (99 - 1) + 1);
            gameIDClash = false;
            if (this.games.has(newGameID)) {
                timeLog(`Context.newGame: gameID clash:${newGameID};`); 
                gameIDClash = true;
                break;
            }
        } while (gameIDClash);
        let newGame = new GameModel(newGameID);
        this.games.set(newGameID, newGame)
        newGame.setPlayerName(1, playerNameInput);
        timeLog(`Context.newGame: new game created with gameID:${newGame.gameID};`);
        if (this.status == "initial") {
            this.status = "game(s) created";
        }
        return newGame;
    }

    getContextInfo() {
        return {
            status: this.status,
            numberOfGames: this.games.size,
        };
    }

}

//exports.Context = Context.Instance;