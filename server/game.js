const defaultCellImg =
  "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
const Player = require("./player");

class Game {
  constructor(name, size) {
    this.name = name;
    this.sockets = {};
    this.players = {};
    this.currentTurn = null;
    this.cells = [];
    this.size = size;
    this.canPlay = false;
    this.canJoin = true;
    this.winner = { img: "" };
    for (var i = 0; i < size * size; i++) {
      this.cells.push({ id: i, img: defaultCellImg, canClick: true, mark: "" });
    }
  }

  addPlayer(socket, username, img) {
    if (!this.canJoin) return;
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(socket.id, username, img);
    if (this.currentTurn == null) this.currentTurn = socket.id;
    socket.emit("update", this.createUpdate());
  }

  removePlayer(socket) {
    this.nextPlayer(socket.id);
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  start() {
    this.canPlay = true;
    this.canJoin = false;
  }

  move(socketID, cellID) {
    if (!this.canPlay) return;
    if (this.players[socketID].id != this.currentTurn) return;

    this.cells[cellID].img = this.players[socketID].img;
    this.cells[cellID].canClick = false;
    this.cells[cellID].mark = socketID;
    this.nextPlayer(socketID);
    if (this.checkWin(socketID)) {
      this.canPlay = false;
      this.winner = this.players[socketID];
    }
    this.update();
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

  update() {
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      socket.emit("update", this.createUpdate());
    });
  }

  nextPlayer(socketID) {
    var playersID = [];
    for (var k in this.sockets) playersID.push(k);
    var i = playersID.indexOf(socketID);
    if (i + 1 >= playersID.length) this.currentTurn = playersID[0];
    else this.currentTurn = playersID[i + 1];
  }

  createUpdate() {
    return {
      cells: this.cells,
      currentTurn: this.currentTurn,
      winner: this.winner
    };
  }
}

module.exports = Game;
