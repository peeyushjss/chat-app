'use strict';

const mongoose = require('mongoose');
let db = null;

function connectDatabase() {
    mongoose.connect('mongodb://127.0.0.1:27017/chat-app-dev', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    db = mongoose.connection;
    db.on('error', function callback() {
        console.log("Reconectting database");
        connectDatabase();
    });
    db.once('open', function callback() {
        console.log("Connection with database succeeded.");
    });
}

connectDatabase();

exports.mongoose = mongoose;
exports.db = db;