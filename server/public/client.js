let socket;
socket = io.connect();

const broadcastButton = document.getElementById("broadcast-button");
broadcastButton.addEventListener("touchstart", sendSound, false);
broadcastButton.addEventListener("touchend", stopSound, false);
broadcastButton.addEventListener("touchcancel", stopSound, false);

document.getElementById('broadcast-button').oncontextmenu = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    return false;
};

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

socket.on('openReceivingConnection', (connection) => {
    document.getElementById("speaker").innerHTML = connection.clientName;
    console.log(connection.data);
    displayToast(true);
})

socket.on('closeReceivingConnection', () => {
    displayToast(false);
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

function sendBoop(){
    socket.emit('boop');
}

function sendSound(){
    socket.emit('startSound');
    document.addEventListener(
        "mouseup",
        () => {
            stopSound();
        },
        { once: true }
    );
}

function stopSound(){
    socket.emit('stopSound');
}

function refreshName(newName){
    document.getElementById("client").innerHTML = newName;
}
function displayToast(state){
    const toast = document.getElementById("toast");
    if (state){
        toast.classList.remove("hidden");
    } else {
        toast.classList.add("hidden");
    }
}