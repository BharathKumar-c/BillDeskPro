const db = require('../config/db');

const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM customers WHERE is_active = 1';
    let countQuery = 'SELECT COUNT(*) as total FROM customers WHERE is_active = 1';
    const params = [];

    if (search) {
      query += ' AND (full_name LIKE ? OR phone LIKE ?)';
      countQuery += ' AND (full_name LIKE ? OR phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const finalParams = [...params, parseInt(limit), parseInt(offset)];

    const [customers] = await db.query(query, finalParams);
    const [countResult] = await db.query(countQuery, params);

    res.json({
      customers,
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCustomer = async (req, res) => {
  try {
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE customer_id = ? AND is_active = 1',
      [req.params.id]
    );

    if (customers.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const [invoices] = await db.query(
      `SELECT i.*, COUNT(ii.item_id) as item_count
       FROM invoices i
       LEFT JOIN invoice_items ii ON i.invoice_id = ii.invoice_id
       WHERE i.customer_id = ?
       GROUP BY i.invoice_id
       ORDER BY i.created_at DESC`,
      [req.params.id]
    );

    res.json({ ...customers[0], invoices });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { full_name, phone, email, address, gstin } = req.body;

    const [result] = await db.query(
      'INSERT INTO customers (full_name, phone, email, address, gstin) VALUES (?, ?, ?, ?, ?)',
      [full_name, phone, email, address, gstin]
    );

    res.status(201).json({ message: 'Customer created', customer_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { full_name, phone, email, address, gstin } = req.body;

    await db.query(
      'UPDATE customers SET full_name = ?, phone = ?, email = ?, address = ?, gstin = ? WHERE customer_id = ?',
      [full_name, phone, email, address, gstin, req.params.id]
    );

    res.json({ message: 'Customer updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    await db.query(
      'UPDATE customers SET is_active = 0 WHERE customer_id = ?',
      [req.params.id]
    );

    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };