let socket;

socket = io.connect();

function setName() {
    socket.emit('setName', document.getElementById('nameinput').value);
    document.getElementById("clientname").innerHTML = document.getElementById('nameinput').value;
}

function sendBoop(){
    socket.emit('boop', 'boop');
}

socket.on('clientNumber', (clientNumber) => {
    console.log(clientNumber);
    document.getElementById("clientnumber").innerHTML = clientNumber.toString()
});
