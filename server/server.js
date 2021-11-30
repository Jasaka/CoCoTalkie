const verbose = true;

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

verbose && console.log("Server is running");

let clientNumber;

const io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    verbose && console.log("###### New Connection ######")
    setClientName(namegenerator());

    refreshClientNumber();
    socket.on('setName', setClientName);
    socket.on('boop', playAlert);
    socket.on('startSound', sendSound);
    socket.on('stopSound', stopSound);
    socket.on("disconnect", () => {
        refreshClientNumber();
    });

    function setClientName(newName) {
        if (newName) {
            socket.username = newName;
        } else{
            setClientName(namegenerator());
        }
        socket.emit('refreshName', socket.username);
    }

    function playAlert() {
        verbose && console.log("Broadcasting Boop from: " + socket.username)
        socket.broadcast.emit('playBoop', socket.username);
    }

    function sendSound() {
        socket.broadcast.emit('openReceivingConnection', {
            senderName: socket.username,
            data: "Here be Audio streaming using webRTC or something like it"
        });
    }

    function stopSound() {
        socket.broadcast.emit('closeReceivingConnection');
    }

    function refreshClientNumber() {
        clientNumber = io.sockets.sockets.size;
        verbose && console.log("ID: " + socket.id + " | Current Username: " + socket.username);
        socket.broadcast.emit('clientNumber', clientNumber);
        socket.emit('clientNumber', clientNumber);
    }
}