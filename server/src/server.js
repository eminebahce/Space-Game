const express = require("express");
const socket = require("socket.io");
const http = require("http");

const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.set("port", port);

const players = {};
let bullets = [];
const state = { players, bullets };
io.on("connection", socket => {
  console.log(socket.id);
  socket.on("new player", () => {
    players[socket.id] = {
      velocity: { x: 0, y: 0 },
      position: { x: Math.random() * 800, y: Math.random() * 600 }
    };
  });
  socket.on("movement", data => {
    const player = players[socket.id] || {};
    player.velocity = data.velocity;
  });

  socket.on("bullet", bullet => {
    if (bullet.playerId === socket.id) {
      bullets.push(bullet);
      setTimeout(
        () => (bullets = bullets.filter(element => element.id !== bullet.id)),
        1000
      );
    }
  });

  socket.on("disconnected", () => {
    delete players[socket.id];
    io.emit("update-players", players);
  });
});

setInterval(() => {
  io.sockets.emit("state", state);
}, 1000 / 100);

server.listen(port, () => {
  console.log(`Server is running on port 4000`);
});
