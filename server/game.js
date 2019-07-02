const defaultCellImg =
  "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
const Player = require("./player");
var uuidv1 = require("uuid/v1");

class Game {
  constructor(name) {
    this.name = name;
    this.sockets = {};
    this.players = {};
    this.currentTurn = null;
    this.cells = [];
    this.size = 3;
    this.isStart = false;
    this.canPlay = false;
    this.canJoin = true;
    this.winner = { img: "" };
    // setInterval(this.update,1000/60)  this may lag
  }

  addBot() {
    if (!this.canJoin) return;
    var botID = uuidv1().substring(0, 4);
    this.players[botID] = new Player(
      botID,
      "bot" + botID,
      "https://api.adorable.io/avatars/" + botID,
      true
    );
    this.update();
  }

  addPlayer(socket, username, img) {
    if (!this.canJoin) return;
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(socket.id, username, img, false);
    if (this.currentTurn == null) this.currentTurn = socket.id;
    this.update();
  }

  removePlayer(socket) {
    if (socket.id == this.currentTurn) this.nextPlayer(socket.id);
    delete this.sockets[socket.id];
    delete this.players[socket.id];
    this.update();
  }

  start() {
    this.isStart = true;
    this.canPlay = true;
    this.canJoin = false;

    this.size = Object.keys(this.players).length + 1;
    for (var i = 0; i < this.size * this.size; i++) {
      this.cells.push({ id: i, img: defaultCellImg, canClick: true, mark: "" });
    }

    this.update();
  }

  move(socketID, cellID) {
    if (!this.canPlay) return;
    if (socketID != this.currentTurn) return;

    this.cells[cellID].img = this.players[socketID].img;
    this.cells[cellID].canClick = false;
    this.cells[cellID].mark = socketID;
    this.nextPlayer(socketID);
    if (this.checkWin(socketID)) {
      this.canPlay = false;
      this.winner = this.players[socketID];
    }
    this.update();

    //check for bot
    if (this.players[this.currentTurn].isBot && this.canPlay) {
      setTimeout(this.botMove.bind(this), 1000);
    }
  }

  botMove() {
    var bot = this.players[this.currentTurn];
    var i = Math.floor(Math.random() * this.cells.length);
    while (this.cells[i].mark != "")
      i = Math.floor(Math.random() * this.cells.length);
    this.cells[i].img = bot.img;
    this.cells[i].canClick = false;
    this.cells[i].mark = bot.id;
    this.nextPlayer(bot.id);
    if (this.checkWin(bot.id)) {
      this.canPlay = false;
      this.winner = bot;
    }

    this.update();
    if (this.players[this.currentTurn].isBot && this.canPlay) {
      setTimeout(this.botMove.bind(this), 1000);
    }
  }

  update() {
    if (this.isStart) {
      var tie = true;
      for (var i = 0; i < this.size * this.size; i++) {
        if (this.cells[i].mark == "") tie = false;
      }
      if (tie && !this.winner.id) {
        this.canPlay = false;
        this.winner = {
          img:
            "https://previews.123rf.com/images/choostudio/choostudio1803/choostudio180300049/97413372-vector-game-over-phrase-in-pixel-art-8-bit-style-with-glitch-vhs-effect-three-color-half-shifted-let.jpg"
        };
      }
    }
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      socket.emit("update", this.createUpdate());
    });
  }

  checkWin(id) {
    var cells2D = [];
    var cells = [...this.cells];
    while (cells.length) cells2D.push(cells.splice(0, this.size));
    //horizontal
    for (var i = 0; i < this.size; i++)
      for (var j = 1; j < this.size - 1; j++)
        if (
          cells2D[i][j].mark == cells2D[i][j - 1].mark &&
          cells2D[i][j].mark == cells2D[i][j + 1].mark &&
          cells2D[i][j].mark == id
        )
          return true;

    // vertical
    for (var j = 0; j < this.size; j++)
      for (var i = 1; i < this.size - 1; i++)
        if (
          cells2D[i][j].mark == cells2D[i - 1][j].mark &&
          cells2D[i][j].mark == cells2D[i + 1][j].mark &&
          cells2D[i][j].mark == id
        )
          return true;

    //diagonal
    for (var i = 0; i < this.size - 2; i++)
      for (var j = 0; j < this.size - 2; j++)
        if (
          cells2D[i][j].mark == cells2D[i + 1][j + 1].mark &&
          cells2D[i][j].mark == cells2D[i + 2][j + 2].mark &&
          cells2D[i][j].mark == id
        )
          return true;

    //other diagonal
    for (var i = 0; i < this.size - 2; i++)
      for (var j = 2; j < this.size; j++)
        if (
          cells2D[i][j].mark == cells2D[i + 1][j - 1].mark &&
          cells2D[i][j].mark == cells2D[i + 2][j - 2].mark &&
          cells2D[i][j].mark == id
        )
          return true;

    // otherwise
    return false;
  }

  nextPlayer(socketID) {
    var playersID = [];
    for (var k in this.players) playersID.push(k);
    var i = playersID.indexOf(socketID);
    if (i + 1 >= playersID.length) this.currentTurn = playersID[0];
    else this.currentTurn = playersID[i + 1];
  }

  createUpdate() {
    return {
      cells: this.cells,
      currentTurn: this.currentTurn,
      winner: this.winner,
      players: ObjToArr(this.players),
      isStart: this.isStart,
      roomID: this.name,
      size: this.size
    };
  }
}

function ObjToArr(arr) {
  return Object.keys(arr).map(function(key) {
    return arr[key];
  });
}
module.exports = Game;
