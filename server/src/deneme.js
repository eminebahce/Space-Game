const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.set('port', port);

let players = {};

io.on('connection', socket => {
    console.log('User connected');
    console.log(socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
});

setInterval(()=>{
    io.sockets.emit('state', players);
}, 1000/60);

server.listen(port, () => {
    console.log(`Listening on port, ${port}`);
});