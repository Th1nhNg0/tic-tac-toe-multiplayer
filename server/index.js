var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

io.on("connection", function(socket) {
  socket.on("send", function(data) {
    io.emit("chat", data);
  });
});

app.get("/", function(req, res) {
  res.send("hello world");
});

server.listen(3000, () => console.log("server start"));
