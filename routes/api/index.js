// Require necessary packages and files
const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');
// Prefix all user routes with '/users'
router.use('/users', userRoutes);
// Prefix all thought routes with '/thoughts'
router.use('/thoughts', thoughtRoutes);

module.exports = router;