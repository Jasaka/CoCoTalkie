const path = require("path");
const express = require('express');
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const socket = require('socket.io');

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

const app = express();
const server = app.listen(3000);
app.use(connectLivereload());

app.use(express.static('public'));

console.log("Server is running");

let clientNumber;
const io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("new connection: " + socket.id);

    clientNumber = io.sockets.sockets.size;
    socket.emit('clientNumber', clientNumber);
    socket.broadcast.emit('clientNumber', clientNumber);
    socket.on('setName', setClientName)

    function setClientName(newName) {
        console.log(newName);
    }
}