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
const clientMap = new Map();

const io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("new connection: " + socket.id);

    let isSendingSound = false;

    clientNumber = io.sockets.sockets.size;
    socket.emit('clientNumber', clientNumber);
    socket.broadcast.emit('clientNumber', clientNumber);
    socket.on('setName', setClientName);
    socket.on('boop', playBoop);
    socket.on('startSound', () => {
        isSendingSound = true;
        sendSound();
    });
    socket.on('stopSound', () => isSendingSound = false);

    function setClientName(newName) {
        clientMap.set(socket.id, newName);
    }

    function playBoop() {
        socket.broadcast.emit('playBoop', clientMap.get(socket.id));
    }

    function sendSound() {
        while (isSendingSound) {
            socket.broadcast.emit('playSound', {value: "Here be Audio streaming using webRTC or something like it"});
        }
    }

}