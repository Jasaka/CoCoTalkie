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

    setClientNumber();
    socket.broadcast.emit('clientNumber', clientNumber);
    socket.on('setName', setClientName);
    socket.on('boop', playBoop);
    socket.on('startSound', sendSound);
    socket.on('stopSound', stopSound);
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
        socket.broadcast.emit('openReceivingConnection', {
            clientName: socket.username,
            data: "Here be Audio streaming using webRTC or something like it"
        });
    }

    function stopSound() {
        socket.broadcast.emit('closeReceivingConnection');
    }

    function setClientNumber() {
        clientNumber = io.sockets.sockets.size;
        socket.broadcast.emit('clientNumber', clientNumber);
    }
}