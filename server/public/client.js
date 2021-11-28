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
    const nameFromInput = document.getElementById('nameinput').value;

    if (nameFromInput){
        socket.emit('setName', nameFromInput);
        refreshName(nameFromInput);
    } else{
        alert("Please input a Username if you want to set one!")
    }
}

function sendName(name) {
    socket.emit('setName', name);
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