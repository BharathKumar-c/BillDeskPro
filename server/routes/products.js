const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, getProducts);
router.get('/:id', auth, getProduct);
router.post('/', auth, adminOnly, createProduct);
router.put('/:id', auth, adminOnly, updateProduct);
router.delete('/:id', auth, adminOnly, deleteProduct);

module.exports = router;