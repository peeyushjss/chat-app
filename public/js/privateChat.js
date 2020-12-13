'use strict';

let socket = io(),
    sender = "",
    receiver = "";

/* event will trigger when user close the browser tab or browser */
socket.on('disconnect', function() {
    console.log(' disconnected from server! ');
});

function enterName() {
    /* get username */
    let name = document.getElementById("name").value;
    /* send it to server */
    socket.emit("user_connected", name);
    /* save my name in global variable */
    sender = name;
    return false;
}

/* listen from server */
socket.on("user_connected", function(username) {
    let html = "";
    if (sender !== username) {
        html += "<li><button onclick='onUserSelected(this.innerHTML);'>" + username + "</button></li>";
        document.getElementById("users").innerHTML += html;
    }
});

function onUserSelected(username) {
    /* save selected user's name in global variable */
    receiver = username;
}

function sendMessage() {
    /* get message */
    let message = document.getElementById("message").value;
    /* send message to server */
    socket.emit("send_message", {
        sender: sender,
        receiver: receiver,
        message: message
    });
    /* append your own message */
    let html = "";
    html += "<li>You said: " + message + "</li>";
    document.getElementById("messages").innerHTML += html;
    return false;
}

/* listen from server */
socket.on("new_message", function(data) {
    let html = "";
    html += "<li>" + data.sender + " says: " + data.message + "</li>";
    document.getElementById("messages").innerHTML += html;
});