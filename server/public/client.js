let socket;

socket = io.connect();

function sendMessage() {
    socket.emit('message', "AAAAAAHHHHHHHH");
}

function sendBoop(){
    socket.emit('boop', 'boop');
}

socket.on('clientNumber', (clientNumber) => {
    console.log(clientNumber);
    document.getElementById("clientnumber").innerHTML = clientNumber.toString()
});