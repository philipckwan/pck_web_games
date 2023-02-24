export const GameFSM = {
  start: {
    message: "Waiting for both players to start a game",
    poll: true,
  },
  player1Joined: {
    message: "Player 1 joined, waiting for player 2 to start a game",
    poll: true,
  },
  startPlacement: {
    next: {
      success: "carrierStartPlaced",
      fail: "start"
    },
    //condition: input => input === "start" || input === "reset",
    message: "Please place the start of carrier. Carrier occupies 5 squares",
    length: 1,
    poll: false,
  },
  carrierStartPlaced: {
    next: {
      success: "carrierEndPlaced",
      fail: "carrierStartPlaced"
    },
    message: "Please place the end of carrier. Carrier occupies 5 squares",
    length: 5,
    poll: false,
  },
  carrierEndPlaced: {
    next: {
      success: "battleshipStartPlaced",
      fail: "carrierEndPlaced"
    },
    message: "Please place the start of battleship. Battleship occupies 4 squares",
    length: 1,
    poll: false,
  },
  battleshipStartPlaced: {
    next: {
      success: "battleshipEndPlaced",
      fail: "battleshipStartPlaced"
    },
    message: "Please place the end of battleship. Battleship occupies 4 squares",
    length: 4,
    poll: false,
  },
  battleshipEndPlaced: {
    next: {
      success: "cruiserStartPlaced",
      fail: "battleshipEndPlaced"
    },
    message: "Please place the start of cruiser. Cruiser occupies 3 squares",
    length: 1,
    poll: false,
  },
  cruiserStartPlaced: {
    next: {
      success: "cruiserEndPlaced",
      fail: "cruiserStartPlaced"
    },
    message: "Please place the end of cruiser. Cruiser occupies 3 squares",
    length: 3,
    poll: false,
  },
  cruiserEndPlaced: {
    next: {
      success: "submarineStartPlaced",
      fail: "cruiserEndPlaced"
    },
    message: "Please place the start of submarine. Submarine occupies 3 squares",
    length: 1,
    poll: false,
  },
  submarineStartPlaced: {
    next: {
      success: "submarineEndPlaced",
      fail: "submarineStartPlaced"
    },
    message: "Please place the end of submarine. Submarine occupies 3 squares",
    length: 3,
    poll: false,
  },
  submarineEndPlaced: {
    next: {
      success: "destroyerStartPlaced",
      fail: "submarineEndPlaced"
    },
    message: "Please place the start of destroyer. Destroyer occupies 2 squares",
    length: 1,
    poll: false,
  },
  destroyerStartPlaced: {
    next: {
      success: "destroyerEndPlaced",
      fail: "destroyerStartPlaced"
    },
    message: "Please place the end of destroyer. Destroyer occupies 2 squares",
    length: 2,
    poll: false,
  },
  destroyerEndPlaced: {
    message: "Game is ready to begin. Sending placements to server.",
    poll: true,
  },
  OnePlacementReceived: {
    message: "Ship placements sent to server, will wait for game to start",
    poll: true,
  },
  thisPlayerTurn: {
    message: "It is your turn, please make a move",
    poll: false,
  },
  otherPlayerTurn: {
    message: "It is your opponent's turn, please wait",
    poll: true,
  },
  thisPlayerWin: {
    message: "You win! Game is finished!",
    poll: false,
  },
  thisPlayerLose: {
    message: "You lose! Game is finished!",
    poll: false,
  },
};