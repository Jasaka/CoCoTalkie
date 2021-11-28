const path = require("path");
const express = require('express');
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const socket = require('socket.io');
const namegenerator = require('./namegenerator');

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

const app = express();
const server = app.listen(64046);
app.use(connectLivereload());

app.use(express.static('public'));

console.log("Server is running");

let clientNumber;

const io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("new connection: " + socket.id);
    setClientName(namegenerator());
    let isSendingSound = false;

    setClientNumber();
    socket.emit('clientNumber', clientNumber);
    socket.broadcast.emit('clientNumber', clientNumber);
    socket.on('setName', setClientName);
    socket.on('boop', playBoop);
    socket.on('startSound', () => {
        isSendingSound = true;
        sendSound();
    });
    socket.on('stopSound', () => isSendingSound = false);
    socket.on("disconnect", () => {
        setClientNumber();
    });

    function setClientName(newName) {
        socket.username = newName;
        socket.emit('refreshName', socket.username);
    }

    function playBoop() {
        socket.broadcast.emit('playBoop', socket.username);
    }

    function sendSound() {
        socket.broadcast.emit('playSound', "Here be Audio streaming using webRTC or something like it");
    }

    function setClientNumber(){
        clientNumber = io.sockets.sockets.size;
    }
}