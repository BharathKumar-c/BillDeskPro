const express = require('express');
const router = express.Router();
const { getInvoices, getInvoice, createInvoice, updatePayment, voidInvoice } = require('../controllers/invoiceController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, getInvoices);
router.get('/:id', auth, getInvoice);
router.post('/', auth, createInvoice);
router.patch('/:id/payment', auth, updatePayment);
router.patch('/:id/void', auth, adminOnly, voidInvoice);

module.exports = router;