export const GameFSM = {
  start: {
    next: {
      success: "carrierStartPlaced",
      fail: "start"
    },
    //condition: input => input === "start" || input === "reset",
    message: "Please start by placing the start of carrier",
    length: 1,
  },
  carrierStartPlaced: {
    next: {
      success: "carrierEndPlaced",
      fail: "carrierStartPlaced"
    },
    message: "Please place the end of carrier",
    length: 5,
  },
  carrierEndPlaced: {
    next: {
      success: "battleshipStartPlaced",
      fail: "carrierEndPlaced"
    },
    message: "Please place the start of battleship",
    length: 1,
  },
  battleshipStartPlaced: {
    next: {
      success: "battleshipEndPlaced",
      fail: "battleshipStartPlaced"
    },
    message: "Please place the end of battleship",
    length: 4,
  },
  battleshipEndPlaced: {
    next: {
      success: "cruiserStartPlaced",
      fail: "battleshipEndPlaced"
    },
    message: "Please place the start of cruiser",
    length: 1,
  },
  cruiserStartPlaced: {
    next: {
      success: "cruiserEndPlaced",
      fail: "cruiserStartPlaced"
    },
    message: "Please place the end of cruiser",
    length: 3,
  },
  cruiserEndPlaced: {
    next: {
      success: "submarineStartPlaced",
      fail: "cruiserEndPlaced"
    },
    message: "Please place the start of submarine",
    length: 1,
  },
  submarineStartPlaced: {
    next: {
      success: "submarineEndPlaced",
      fail: "submarineStartPlaced"
    },
    message: "Please place the end of submarine",
    length: 3,
  },
  submarineEndPlaced: {
    next: {
      success: "destroyerStartPlaced",
      fail: "submarineEndPlaced"
    },
    message: "Please place the start of destroyer",
    length: 1,
  },
  destroyerStartPlaced: {
    next: {
      success: "destroyerEndPlaced",
      fail: "destroyerStartPlaced"
    },
    message: "Please place the end of destroyer",
    length: 2,
  },
  destroyerEndPlaced: {
    next: {
      success: "gameStart",
      fail: "destroyerEndPlaced"
    },
    message: "Game is ready to begin",
    length: 0,
  },
};