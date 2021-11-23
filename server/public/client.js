let socket;

socket = io.connect('http://localhost:3000');

function sendMessage() {
    socket.emit('message', "AAAAAAHHHHHHHH");
}

function sendBoop(){
    socket.emit('boop', 'boop');
}