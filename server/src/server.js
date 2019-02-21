const express = require("express");
const socket = require("socket.io");
const http = require("http");

const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.set("port", port);

const players = [];
let bullets = [];
const state = { players, bullets };
io.on("connection", socket => {
  console.log(socket.id);
  socket.on("new player", () => {
    players.push({
      id: socket.id,
      velocity: { x: 0, y: 0 },
      position: { x: Math.random() * 800, y: Math.random() * 600 }
    });
  });
  socket.on("movement", data => {
    const player = players.find(player => player.id === socket.id) || {};
    player.velocity = data.velocity;
  });

  socket.on("kill_player", id => {
    const index = players.findIndex(player => player.id === id);
    players.splice(index, 1);
  });

  socket.on("shoot_bullet", bullet => {
    console.log(bullet);
    if (bullet.playerId === socket.id) {
      bullets.push(bullet);
    }
    console.log(state.bullets);
  });

  socket.on("remove_bullet", id => {
    const index = bullets.findIndex(bullet => bullet.id === id);
    bullets.splice(index, 1);
    // const newBulletArray = state.bullets.filter(bullet => bullet.id !== id);
    // state.bullets = newBulletArray;
    // bullets.filter(bullet => bullet.id !== id);
  });

  socket.on("disconnected", () => {
    const index = players.findIndex(player => player.id === id);
    players.splice(index, index + 1);
  });
});

setInterval(() => {
  io.sockets.emit("state", state);
}, 1000 / 60);

server.listen(port, () => {
  console.log(`Server is running on port 4000`);
});
