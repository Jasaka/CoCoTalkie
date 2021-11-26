let socket;

socket = io.connect();

initName();

function initName(){
    document.getElementById("clientname").innerHTML = generateName();
    socket.emit('setName', document.getElementById('nameinput').value);
}

function setName() {
    socket.emit('setName', document.getElementById('nameinput').value);
    document.getElementById("clientname").innerHTML = document.getElementById('nameinput').value;
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
    console.log(data.value);
})

