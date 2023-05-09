const { connect, connection } = require('mongoose');


connect('mongodb://')

module.exports = connection;
