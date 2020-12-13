'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/index');
const moment = require('moment');

const { generateMessage } = require('./utils/message');
const { isRealString } = require('./utils/isRealString');
const { Users } = require('./utils/users');
const axios = require('axios');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 4000
let app = express(),
    server = http.createServer(app),
    io = socketIO(server),
    users = new Users();

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(publicPath));
app.use(cors());

/* middleware body-parser used for getting data from request.body */
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

/* create socket connection */
io.on('connection', (socket) => {
    console.log("A new user connected!");

    /* handle when join(custom event) will trigger */
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room are required!');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', `Welocome to ${params.room}!`));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', "New User Joined!"));
        callback();
    });

    /* handle when createMessage event trigger to create a new messgae */
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);
        if (user && message && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
            /* code for saving message in the database */
            axios.post('http://localhost:' + port + '/api/messages', {
                "sender": user.name,
                "receiver": "",
                "room": user.room,
                "message": message.text,
                "createdAt": moment().format('L'),
                "read": false
            }).then(function(response) {
                if (response.status === 200) {
                    console.log(" Messgae saved successfully in database! ");
                } else {
                    console.log(" Getting error at the time message saving in database! ");
                }
            });
        }
        callback('This is the server:');
    });

    /* when a new user is created in case of one to one chat */
    socket.on("user_connected", function(username) {
        users[username] = socket.id;
        /* socket ID will be used to send message to individual person */
        io.emit("user_connected", username);
    });

    /* listen from client inside IO "connection" event */
    socket.on("send_message", function(data) {
        /* send event to receiver */
        let socketId = users[data.receiver];
        io.to(socketId).emit("new_message", data);
        /* code for saving message in the database */
        axios.post('http://localhost:' + port + '/api/messages', {
            "sender": data.sender,
            "receiver": data.receiver,
            "room": "",
            "message": data.message,
            "createdAt": moment().format('L'),
            "read": false
        }).then(function(response) {
            if (response.status === 200) {
                console.log(" Messgae saved successfully in database! ");
            } else {
                console.log(" Getting error at the time message saving in database! ");
            }
        });
    });

    /* Handle when user is disconnected */
    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room.`))
        }
    });
});

/* Getting a path for model directory, where schema is defined */
let normalizedPath = require("path").join(__dirname, "./models");

/* Registering mongoose schema */
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./models/" + file);
});

/* server will listen on port, default port is 4000 */
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

require('./route')(app);