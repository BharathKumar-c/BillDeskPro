const express = require('express');
const router = express.Router();
const { getSummary, getSalesTrend, getTopProducts, getTopCustomers, exportReport } = require('../controllers/reportController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/summary', auth, adminOnly, getSummary);
router.get('/sales-trend', auth, adminOnly, getSalesTrend);
router.get('/top-products', auth, adminOnly, getTopProducts);
router.get('/top-customers', auth, adminOnly, getTopCustomers);
router.get('/export', auth, adminOnly, exportReport);

module.exports = router;