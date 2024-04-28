// Require necessary packages and files
const router = require('express').Router();
const apiRoutes = require('./api');
// Append all routes found in the api folder with '/api'
router.use('/api', apiRoutes);

module.exports = router;