// Require necessary packages and files
const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');
// Retrieve and store the current working directory of the node.js process
const cwd = process.cwd();
// Define a port to connect to
const PORT = process.env.PORT || 3001;
// Initialize the app
const app = express();
// Add necessary middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
// Event listener that waits for the database connection to open successfully (db.once('open', ...)) then start the server on the specified port
db.once('open', () => {
    app.listen(PORT, () => {
        // Once the server is successfully connected, log the following to the console
        console.log(`API running on port ${PORT}`);
    });
});