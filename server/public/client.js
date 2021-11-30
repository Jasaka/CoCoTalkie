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

socket.on('playBoop', (senderName) => {
    playSound(senderName);
});

socket.on('playSound', (data) => {
    console.log(data);
})

socket.on('refreshName', (newName) => {
    refreshName(newName);
})

socket.on('openReceivingConnection', (connection) => {
    console.log(connection.data);
    displayToast(true, connection.senderName);
})

socket.on('closeReceivingConnection', () => {
    displayToast(false);
})

function setName() {
    const nameFromInput = document.getElementById('nameinput').value;

    socket.emit('setName', nameFromInput);
    refreshName(nameFromInput);
}

function sendBoop() {
    socket.emit('boop');
}

function playSound(senderName){
    displayToast(true, senderName);

    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease("C4", "8n", now);
    synth.triggerAttackRelease("E4", "8n", now + 0.5);
    synth.triggerAttackRelease("G4", "8n", now + 1);

    synth.onsilence = () => displayToast(false);
}

function sendSound() {
    socket.emit('startSound');
    document.addEventListener(
        "mouseup",
        () => {
            stopSound();
        },
        {once: true}
    );
}

function stopSound() {
    socket.emit('stopSound');
}

function refreshName(newName) {
    document.getElementById("client").innerHTML = newName;
}

function displayToast(isDisplayed, senderName = "Loading...") {
    const toast = document.getElementById("toast");
    if (isDisplayed) {
        console.log("yes");
        document.getElementById("speaker").innerHTML = senderName;
        toast.classList.remove("hidden");
    } else {
        console.log("no");
        toast.classList.add("hidden");
    }
}