const express = require('express');
const router = express.Router();
const { signup, login, getUsers } = require('../controllers/authController');

// Define authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/users', getUsers);

module.exports = router; 