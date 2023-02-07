class PCKUtils {

  static timeLog (msg) {
    let current = new Date();
    let currentTime  = current.toLocaleTimeString();
    console.log(`[${currentTime}]${msg}`);
  }

  static add (a, b) {
    return a + b;
  }

}

exports.timeLog = PCKUtils.timeLog;

/*
exports.add = (a, b) => {
  return a + b;
}
*/