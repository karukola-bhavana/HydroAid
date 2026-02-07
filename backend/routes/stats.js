const express = require('express');
const router = express.Router();
const { getDashboardStats, getDepartmentStats, getLiveDonations, createDonation } = require('../controllers/statsController');

// Statistics routes
router.get('/dashboard', getDashboardStats);
router.get('/department/:departmentId', getDepartmentStats);
router.get('/donations/live', getLiveDonations);
router.post('/donations', createDonation);

module.exports = router; 