const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../dashboardController');
// Import your auth middleware if needed, e.g.:
// const { protect } = require('../middleware/authMiddleware');

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats); 

module.exports = router;