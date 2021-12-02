let socket;
socket = io.connect();
let isTransmitting = false;
let isReceivingTransmission = false;

let audio;

function enableCoCoTalkie() {
    audio = document.createElement('audio');

    const modal = document.getElementById("modal");
    modal.classList.add("hidden");
}

const broadcastButton = document.getElementById("broadcast-button");
broadcastButton.addEventListener("touchstart", startTransmission, false);
broadcastButton.addEventListener("touchend", stopTransmission, false);
broadcastButton.addEventListener("touchcancel", stopTransmission, false);

document.getElementById('broadcast-button').oncontextmenu = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    return false;
};

socket.on('clientNumber', (clientNumber) => {
    document.getElementById("clientnumber").innerHTML = clientNumber.toString()
});

socket.on('playBoop', (senderName) => {
    playAlert(senderName);
});

socket.on('playAlert', (data) => {
    console.log(data);
})

socket.on('refreshName', (newName) => {
    refreshName(newName);
})
socket.on('openReceivingConnection', (connection) => {
    playTransmission(connection);
})

socket.on('closeReceivingConnection', () => {
    displayToast(false);
    isReceivingTransmission = false;
})

function setName() {
    const nameFromInput = document.getElementById('nameinput').value;

    socket.emit('setName', nameFromInput);
    refreshName(nameFromInput);
}

function sendAlert() {
    socket.emit('alert');
}

function playAlert(senderName) {
    displayToast(true, senderName);

    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease("C6", "8n", now);
    synth.triggerAttackRelease("G6", "8n", now + 0.1);
    synth.triggerAttackRelease("C6", "8n", now + 0.2);
    synth.triggerAttackRelease("G6", "8n", now + 0.3);
    synth.triggerAttackRelease("C6", "8n", now + 0.4);
    synth.triggerAttackRelease("G6", "8n", now + 0.5);
    synth.triggerAttackRelease("C6", "8n", now + 0.6);
    synth.triggerAttackRelease("G6", "8n", now + 0.7);
    synth.triggerAttackRelease("C6", "8n", now + 0.8);
    synth.triggerAttackRelease("G6", "8n", now + 0.9);
    synth.triggerAttackRelease("C6", "8n", now + 1);

    synth.onsilence = () => displayToast(false);
}

function startTransmission() {
    isTransmitting = true;
    document.addEventListener(
        "mouseup",
        () => {
            stopTransmission();
        },
        {once: true}
    );

    let intervalId;

    const constraints = {audio: true};
    navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
        const mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.onstart = (event) => {
            this.chunks = [];
        };
        mediaRecorder.ondataavailable = (event) => {
            this.chunks.push(event.data);
        };
        mediaRecorder.onstop = (event) => {
            const blob = new Blob(this.chunks, {'type': 'audio/ogg; codecs=opus'});
            socket.emit('startTransmission', blob);
            !isTransmitting && clearInterval(intervalId) && socket.emit('stopTransmission');
        };

        mediaRecorder.start();
        intervalId = setInterval(() => {
            mediaRecorder.stop();
            mediaRecorder.start();
        }, 200);
    });
}

function stopTransmission() {
    isTransmitting = false;
    socket.emit('stopTransmission');
}

function playTransmission(connection) {
    isReceivingTransmission = true;
    displayToast(true, connection.senderName);
    const blob = new Blob([connection.data], {'type': 'audio/ogg; codecs=opus'});
    audio.src = window.URL.createObjectURL(blob);
    audio.play();
}

function refreshName(newName) {
    document.getElementById("client").innerHTML = newName;
}

function displayToast(isDisplayed, senderName = "Loading...") {
    const toast = document.getElementById("toast");
    if (isDisplayed) {
        document.getElementById("speaker").innerHTML = senderName;
        toast.classList.remove("hidden");
    } else {
        toast.classList.add("hidden");
    }
}