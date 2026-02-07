const express = require('express');
const router = express.Router();

const { createIssue } = require('../controllers/issuesController');

// Create issue
router.post('/', createIssue);

module.exports = router;



