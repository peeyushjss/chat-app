'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * @module  Message
 * @description contain the details of message  
 */

let MsgSchema = new Schema({

    /* Sender. It can containg string, is required field */
    sender: { type: String, required: true },

    /* Receiver. It can containg string, is not required field */
    receiver: { type: String },

    /* Message. It can containg string, is required field */
    message: { type: String, required: true },

    /* Room. It can containg string, is not required field */
    room: { type: String },

    /* createdAt. It can containg string, is not required field */
    createdAt: { type: String },

    /* read. It can containg string, is not required field */
    read: { type: Boolean }

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true } //seting toJSON option on the schema, so that virtual works when it return json data

});

/* query for inserting a message in database */
MsgSchema.statics.createMsgs = function(requestData, callback) {
    this.create(requestData, callback);
};

/* query for fetching all messages from database */
MsgSchema.statics.getAllMsgs = function(filter, callback) {
    if (filter) {
        this.find(filter, callback);
    } else {
        this.find({}, callback);
    }
};

/* query for updating read value if message seen by user in database */
MsgSchema.statics.setReads = function(msgId, callback) {
    this.findOneAndUpdate({ '_id': msgId }, { $set: { read: true } }, { new: true, useFindAndModify: false }, callback);
}


/* create a model for message schema */
let msg = mongoose.model('message', MsgSchema);

/* export schema */
module.exports = {
    Msg: msg
};