"use strict";

const mongoose = require('mongoose'),
    message = mongoose.model('message'),
    _ = require('lodash');

/* Business logic for inserting a message in database */
exports.createMsg = (req, res, next) => {
    let requestBody = _.get(req, 'body', {});
    message.createMsgs(requestBody, (err, result) => {
        if (err) {
            console.log(JSON.stringify(err) + " L-12 F-/controller/message.js");
            res.json({ status: false, error: err, message: "oops something went wrong!" });
        } else {
            res.json({ status: true, result: result });
        }
    });
};

/* Business logic for fetching all messages from database */
exports.getAllMsg = (req, res) => {
    message.getAllMsgs((err, messages) => {
        if (!err) {
            res.json({ status: true, result: messages });
        } else {
            console.log("oops something went wrong fetching all messages L-26 F-/controller/message.js");
            res.json({ status: false, error: err, message: "oops something went wrong!" });
        }
    });
};


/* Business logic for fetching read value true in database if message seen by user */
exports.setRead = (req, res) => {
    let requestBody = _.get(req, 'body', {});
    message.setReads(requestBody, (err, result) => {
        if (!err) {
            res.json({ status: true, result: " update record successfully! " });
        } else {
            console.log("oops something went wrong fetching all messages L-26 F-/controller/message.js");
            res.json({ status: false, error: err, message: "oops something went wrong!" });
        }
    });
};