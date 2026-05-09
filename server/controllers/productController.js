const db = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products WHERE is_active = 1';
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE is_active = 1';
    const params = [];

    if (search) {
      query += ' AND (product_name LIKE ? OR sku LIKE ?)';
      countQuery += ' AND (product_name LIKE ? OR sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND category = ?';
      countQuery += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const finalParams = [...params, parseInt(limit), parseInt(offset)];

    const [products] = await db.query(query, finalParams);
    const [countResult] = await db.query(countQuery, params);

    res.json({
      products,
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProduct = async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT * FROM products WHERE product_id = ? AND is_active = 1',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { product_name, sku, category, unit_price, stock_quantity, unit_of_measure, description } = req.body;

    const [existing] = await db.query('SELECT product_id FROM products WHERE sku = ?', [sku]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'SKU already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO products (product_name, sku, category, unit_price, stock_quantity, unit_of_measure, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [product_name, sku, category, unit_price, stock_quantity, unit_of_measure || 'piece', description]
    );

    res.status(201).json({ message: 'Product created', product_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { product_name, sku, category, unit_price, stock_quantity, unit_of_measure, description } = req.body;

    const [existing] = await db.query(
      'SELECT product_id FROM products WHERE sku = ? AND product_id != ?',
      [sku, req.params.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'SKU already exists' });
    }

    await db.query(
      'UPDATE products SET product_name = ?, sku = ?, category = ?, unit_price = ?, stock_quantity = ?, unit_of_measure = ?, description = ? WHERE product_id = ?',
      [product_name, sku, category, unit_price, stock_quantity, unit_of_measure, description, req.params.id]
    );

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await db.query(
      'UPDATE products SET is_active = 0 WHERE product_id = ?',
      [req.params.id]
    );

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };