var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var uuidv1 = require("uuid/v1");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public"));
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}
var Game = require("./game");
var games = {};
var playersCount = 0;
io.on("connection", function (socket) {
  playersCount++;
  io.emit('totalPlayers', playersCount);

  socket.on("joinGame", joinGame);
  socket.on("leaveGame", leaveGame);
  socket.on("playAgain", playAgain);
  socket.on("move", handleMove);
  socket.on("disconnect", leaveGame);
  socket.on("disconnect", () => {
    playersCount--;
    io.emit('totalPlayers', playersCount);
  });
});

function playAgain() {
  games[this.roomName].reset();
}

function joinGame({
  username,
  img,
  maxPlayers
}) {
  for (index in games) {
    var game = games[index];
    if (game.canJoin && game.maxPlayers == maxPlayers && Object.keys(game.players).length < maxPlayers) {
      this.roomName = game.name;
      game.addPlayer(this, username, img);
    }
  }
  if (!this.roomName) {
    var roomID = uuidv1().substring(0, 7);
    games[roomID] = new Game(roomID, maxPlayers);
    this.roomName = roomID;
    games[roomID].addPlayer(this, username, img);
  }
}

function leaveGame() {
  if (this.roomName) {
    games[this.roomName].removePlayer(this);
    var players = games[this.roomName].sockets;
    if (Object.keys(players).length == 0) delete games[this.roomName];
    delete this.roomName;
  }
}

function handleMove(cellID) {
  games[this.roomName].move(this.id, cellID);
}

function onStart() {
  games[this.roomName].start();
}

server.listen(process.env.PORT || 5000, () => console.log("server start"));