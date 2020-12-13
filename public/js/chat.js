'use strict';

let socket = io(),
    sender = "",
    receiver = "";

function scrollToBottom() {
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}

socket.on('connect', function() {
    let searchQuery = window.location.search.substring(1),
        params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');

    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No Error');
        }
    });
});

socket.on('disconnect', function() {
    console.log('disconnected from server.');
});

socket.on('updateUsersList', function(users) {
    let ol = document.createElement('ol');
    users.forEach(function(user) {
        let li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    });

    let usersList = document.querySelector('#users');
    usersList.innerHTML = "";
    usersList.appendChild(ol);
})

socket.on('newMessage', function(message) {
    const formattedTime = moment(message.createdAt).format('LT'),
        template = document.querySelector('#message-template').innerHTML,
        html = Mustache.render(template, {
            from: message.from,
            text: message.text,
            createdAt: formattedTime
        });

    let div = document.createElement('div');
    div.innerHTML = html

    document.querySelector('#messages').appendChild(div);
    scrollToBottom();
});

if (document.querySelector('#submit-btn')) {
    document.querySelector('#submit-btn').addEventListener('click', function(e) {
        e.preventDefault();
        socket.emit("createMessage", {
            text: document.querySelector('input[name="message"]').value
        }, function() {
            document.querySelector('input[name="message"]').value = '';
        });
    });
}