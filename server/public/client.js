let socket;

socket = io.connect();

socket.on('clientNumber', (clientNumber) => {
    console.log(clientNumber);
    document.getElementById("clientnumber").innerHTML = clientNumber.toString()
});

socket.on('playBoop', (sentFromClientName) => {
    const boop = new Audio('assets/boop.wav');
    boop.muted = true;
    boop.muted = false;
    boop.play();
    console.log(sentFromClientName);
});

socket.on('playSound', (data) => {
    console.log(data);
})

socket.on('refreshName', (newName) => {
    refreshName(newName);
})

function setName() {
    socket.emit('setName', document.getElementById('nameinput').value);
    refreshName(document.getElementById('nameinput').value);
}

function sendBoop(){
    socket.emit('boop', 'boop');
}

function sendSound(){
    socket.emit('startSound');
}

function stopSound(){
    socket.emit('stopSound');
}

function refreshName(newName){
    document.getElementById("clientname").innerHTML = newName;
}