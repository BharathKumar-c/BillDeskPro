const express = require('express');
const router = express.Router();
const { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, getCustomers);
router.get('/:id', auth, getCustomer);
router.post('/', auth, createCustomer);
router.put('/:id', auth, updateCustomer);
router.delete('/:id', auth, adminOnly, deleteCustomer);

module.exports = router;