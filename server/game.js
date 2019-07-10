const Player = require("./player");
const Board = require("./board");
var uuidv1 = require("uuid/v1");

class Game {
  constructor(name) {
    this.name = name;
    this.sockets = {};
    this.players = {};
    this.currentTurn = null;
    this.board = {};
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

  removeBot(botID) {
    if (!this.isStart && this.players[botID] && this.players[botID].isBot) {
      delete this.players[botID];
      this.update();
    }
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
    this.board = new Board(Object.keys(this.players).length + 1);
    this.update();
  }

  reset() {
    while (this.players[this.currentTurn].isBot) {
      this.nextPlayer(this.currentTurn);
    }
    this.board = new Board(Object.keys(this.players).length + 1);
    this.isStart = false;
    this.canPlay = false;
    this.canJoin = true;
    this.winner = { img: "" };
    this.update();
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
    this.update();

    //check for bot
    if (this.players[this.currentTurn].isBot && this.canPlay) {
      setTimeout(this.botMove.bind(this), 500);
    }
  }

  botMove() {
    var bot = this.players[this.currentTurn];
    var i = Math.floor(Math.random() * this.board.cells.length);
    while (this.board.cells[i].mark != "")
      i = Math.floor(Math.random() * this.board.cells.length);
    if (this.board.size == 3)
      i = bot.minimax(this.board, bot.id, bot.smart, -1e8, 1e8, this.players)
        .move;
    this.board.move(bot, i);
    this.nextPlayer(bot.id);
    if (this.board.win(bot.id)) {
      this.canPlay = false;
      this.winner = bot;
    }

    this.update();
    if (this.players[this.currentTurn].isBot && this.canPlay) {
      setTimeout(this.botMove.bind(this), 500);
    }
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
      var tie = this.board.tie();
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
  return Object.keys(arr).map(function(key) {
    return arr[key];
  });
}
module.exports = Game;
