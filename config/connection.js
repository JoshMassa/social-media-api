// Initiate connection to MongoDB database and access default connection events and states after initiating connection
const { connect, connection } = require('mongoose');
// Configure MongoDB client to interact with socialMediaDB
const connectionString = 'mongodb://127.0.0.1:27017/socialMediaDB';
// Connect to the database
connect(connectionString);

module.exports = connection;