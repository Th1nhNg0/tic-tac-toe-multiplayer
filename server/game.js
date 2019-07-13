const Player = require("./player");
const Board = require("./board");
var uuidv1 = require("uuid/v1");

class Game {
  constructor(name, maxPlayers) {
    this.name = name;
    this.maxPlayers = maxPlayers;
    this.sockets = {};
    this.players = {};
    this.currentTurn = null;
    this.board = {};
    this.isStart = false;
    this.canPlay = false;
    this.canJoin = true;
    this.winner = {
      img: ""
    };
    setInterval(this.update.bind(this), 1000 / 15);
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
  }

  addPlayer(socket, username, img) {
    if (!this.canJoin) return;
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(socket.id, username, img, false);
    if (this.currentTurn == null) this.currentTurn = socket.id;
    if (Object.keys(this.players).length == this.maxPlayers) this.preStart();
  }

  removePlayer(socket) {
    if (socket.id == this.currentTurn) this.nextPlayer(socket.id);
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  start() {
    this.isStart = true;
    this.canPlay = true;
    this.board = new Board(this.maxPlayers + 1);
  }

  preStart() {
    this.canJoin = false;
    var time = 5;
    this.interval = setInterval(() => {
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        socket.emit("waiting", time);
      });
      time--;
      if (time == -1) {
        clearInterval(this.interval);
        this.start();
      }
    }, 1000);
  }

  reset() {
    this.board = new Board(this.maxPlayers + 1);
    this.isStart = false;
    this.canPlay = false;
    this.canJoin = true;
    this.winner = {
      img: ""
    };
    if (Object.keys(this.players).length == this.maxPlayers) this.preStart();
  }

  move(socketID, cellID) {
    if (!this.canPlay) return;
    if (socketID != this.currentTurn) return;

    this.board.move(this.players[socketID], cellID);
    if (this.board.win(socketID)) {
      this.canPlay = false;
      this.winner = this.players[socketID];
    }
    this.nextPlayer(socketID);
  }


  nextPlayer(socketID) {
    var playersID = [];
    for (var k in this.players) playersID.push(k);
    var i = playersID.indexOf(socketID);
    if (i + 1 >= playersID.length) this.currentTurn = playersID[0];
    else this.currentTurn = playersID[i + 1];
  }

  update() {
    if (this.isStart) {
      if (this.board.tie() && !this.winner.id) {
        this.canPlay = false;
        this.winner = {
          img: "https://previews.123rf.com/images/choostudio/choostudio1803/choostudio180300049/97413372-vector-game-over-phrase-in-pixel-art-8-bit-style-with-glitch-vhs-effect-three-color-half-shifted-let.jpg"
        };
      }
    }
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      socket.emit("update", this.createUpdate());
    });
  }

  createUpdate() {
    return {
      cells: this.board.cells,
      currentTurn: this.currentTurn,
      winner: this.winner,
      players: ObjToArr(this.players),
      isStart: this.isStart,
      roomID: this.name,
      size: this.board.size
    };
  }
}

function ObjToArr(arr) {
  return Object.keys(arr).map(function (key) {
    return arr[key];
  });
}
module.exports = Game;