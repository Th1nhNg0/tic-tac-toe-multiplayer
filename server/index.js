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

io.on("connection", function(socket) {
  socket.on("join", joinGame);
  socket.on("leaveGame", leaveGame);
  socket.on("startGame", onStart);
  socket.on("addBot", addBot);
  socket.on("move", handleMove);
  socket.on("disconnect", onDisconnect);
});

function addBot() {
  games[this.roomName].addBot();
}
function joinGame({ username, img }) {
  for (index in games) {
    var game = games[index];
    if (game.canJoin) {
      this.roomName = game.name;
      game.addPlayer(this, username, img);
    }
  }
  if (!this.roomName) {
    var roomID = uuidv1().substring(0, 7);
    games[roomID] = new Game(roomID);
    this.roomName = roomID;
    games[roomID].addPlayer(this, username, img);
  }
}

function leaveGame() {
  if (this.roomName) {
    games[this.roomName].removePlayer(this);
    delete this.roomName;
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
    var players = games[this.roomName].players;
    if (Object.keys(players).length == 0) delete games[this.roomName];
    delete this.roomName;
  }
}
server.listen(process.env.PORT || 5000, () => console.log("server start"));
