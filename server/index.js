var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

const Game = require("./game");
const games = {};

io.on("connection", function(socket) {
  socket.on("join", joinGame);
  socket.on("move", handleMove);
  socket.on("startGame", onStart);
  socket.on("disconnect", onDisconnect);
});

function joinGame({ username, img }) {
  for (index in games) {
    var game = games[index];
    if (game.canJoin) {
      this.roomName = game.name;
      game.addPlayer(this, username, img);
    }
  }
  if (!this.roomName) {
    var roomID = "ROOM_" + username;
    games[roomID] = new Game(roomID, 3);
    this.roomName = roomID;
    games[roomID].addPlayer(this, username, img);
  }
}

function handleMove(cellID) {
  games[this.roomName].move(this.id, cellID);
}

function onStart() {
  games[this.roomName].start();
}

function onDisconnect() {
  if (this.roomName) {
    games[this.roomName].removePlayer(this);
  }
}
server.listen(3000, () => console.log("server start"));
