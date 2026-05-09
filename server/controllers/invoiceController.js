const db = require('../config/db');

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const [result] = await db.query(
    'SELECT COUNT(*) as count FROM invoices WHERE invoice_number LIKE ?',
    [`INV-${year}-%`]
  );
  const number = (result[0].count + 1).toString().padStart(4, '0');
  return `INV-${year}-${number}`;
};

const getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', startDate = '', endDate = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT i.*, c.full_name as customer_name
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.customer_id
      WHERE i.is_voided = 0
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM invoices WHERE is_voided = 0';
    const params = [];

    if (search) {
      query += ' AND (i.invoice_number LIKE ? OR c.full_name LIKE ?)';
      countQuery += ' AND (invoice_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      query += ' AND i.payment_status = ?';
      countQuery += ' AND payment_status = ?';
      params.push(status);
    }

    if (startDate && endDate) {
      query += ' AND DATE(i.invoice_date) BETWEEN ? AND ?';
      countQuery += ' AND DATE(invoice_date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
    const finalParams = [...params, parseInt(limit), parseInt(offset)];

    const [invoices] = await db.query(query, finalParams);
    const [countResult] = await db.query(countQuery, params);

    res.json({
      invoices,
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getInvoice = async (req, res) => {
  try {
    const [invoices] = await db.query(
      `SELECT i.*, c.full_name as customer_name, c.phone as customer_phone, c.address as customer_address, c.gstin as customer_gstin,
              u.full_name as created_by_name
       FROM invoices i
       LEFT JOIN customers c ON i.customer_id = c.customer_id
       LEFT JOIN users u ON i.created_by = u.user_id
       WHERE i.invoice_id = ?`,
      [req.params.id]
    );

    if (invoices.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const [items] = await db.query(
      'SELECT * FROM invoice_items WHERE invoice_id = ?',
      [req.params.id]
    );

    res.json({ ...invoices[0], items });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createInvoice = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { customer_id, invoice_date, items, tax_rate = 0, discount_type = 'none', discount_value = 0, notes } = req.body;

    const invoice_number = await generateInvoiceNumber();

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.unit_price * item.quantity;
    }

    const taxAmount = subtotal * (tax_rate / 100);
    let discountAmount = 0;

    if (discount_type === 'percent') {
      discountAmount = subtotal * (discount_value / 100);
    } else if (discount_type === 'fixed') {
      discountAmount = discount_value;
    }

    const grand_total = subtotal + taxAmount - discountAmount;

    const [invoiceResult] = await connection.query(
      `INSERT INTO invoices (invoice_number, customer_id, created_by, invoice_date, subtotal, tax_rate, tax_amount, discount_type, discount_value, grand_total, payment_status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', ?)`,
      [invoice_number, customer_id, req.user.user_id, invoice_date, subtotal, tax_rate, taxAmount, discount_type, discount_value, grand_total, notes]
    );

    const invoice_id = invoiceResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO invoice_items (invoice_id, product_id, product_name, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [invoice_id, item.product_id, item.product_name, item.unit_price, item.quantity, item.unit_price * item.quantity]
      );

      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Invoice created', invoice_id, invoice_number });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

const updatePayment = async (req, res) => {
  try {
    const { payment_status, amount_paid } = req.body;

    await db.query(
      'UPDATE invoices SET payment_status = ?, amount_paid = ? WHERE invoice_id = ?',
      [payment_status, amount_paid || 0, req.params.id]
    );

    res.json({ message: 'Payment updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const voidInvoice = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [items] = await connection.query(
      'SELECT product_id, quantity FROM invoice_items WHERE invoice_id = ?',
      [req.params.id]
    );

    for (const item of items) {
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.query(
      'UPDATE invoices SET is_voided = 1 WHERE invoice_id = ?',
      [req.params.id]
    );

    await connection.commit();
    res.json({ message: 'Invoice voided' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

module.exports = { getInvoices, getInvoice, createInvoice, updatePayment, voidInvoice };