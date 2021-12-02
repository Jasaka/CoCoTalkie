const verbose = true;

const fs = require('fs');
const https = require('https');
const express = require('express');
const socket = require('socket.io');
const namegenerator = require('./namegenerator');

const app = express();
const port = 64046;
const options = {
    key: fs.readFileSync('./ssl/localhost-key.pem'),
    cert: fs.readFileSync('./ssl/localhost.pem'),
};

const server = https.createServer(options, app).listen(port, () => {
    verbose && console.log("Express server listening on port " + port);
});

app.use(express.static('public'));

let clientNumber;

const io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    verbose && console.log("###### New Connection ######")
    setClientName(namegenerator());

    refreshClientNumber();
    socket.on('setName', setClientName);
    socket.on('alert', playAlert);
    socket.on('startTransmission', broadcastTransmission);
    socket.on('stopTransmission', stopTransmission);
    socket.on("disconnect", () => {
        refreshClientNumber();
    });

    function setClientName(newName) {
        if (newName) {
            socket.username = newName;
        } else {
            setClientName(namegenerator());
        }
        socket.emit('refreshName', socket.username);
    }

    function playAlert() {
        verbose && console.log("Broadcasting Boop from: " + socket.username)
        socket.broadcast.emit('playBoop', socket.username);
    }

    function broadcastTransmission(transmission) {
        socket.broadcast.emit('openReceivingConnection', {
            senderName: socket.username,
            data: transmission
        });
    }

    function stopTransmission() {
        socket.broadcast.emit('closeReceivingConnection');
        setTimeout(() => socket.broadcast.emit('closeReceivingConnection'), 200)
    }

    function refreshClientNumber() {
        clientNumber = io.sockets.sockets.size;
        verbose && console.log("ID: " + socket.id + " | Current Username: " + socket.username);
        socket.broadcast.emit('clientNumber', clientNumber);
        socket.emit('clientNumber', clientNumber);
    }
}