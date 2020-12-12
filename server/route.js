'use strict';

const messages = require('./controllers/message');

/* APIs Endpoint */
module.exports = function(app) {

    app.route('/api/messages')
        .post(messages.createMsg)
        .get(messages.getAllMsg)
        .put(messages.setRead);

};