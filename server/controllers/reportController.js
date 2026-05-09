const db = require('../config/db');

const getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT
        COUNT(*) as total_invoices,
        COALESCE(SUM(grand_total), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN grand_total ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN payment_status = 'unpaid' THEN grand_total ELSE 0 END), 0) as unpaid_amount
      FROM invoices
      WHERE is_voided = 0
    `;
    const params = [];

    if (startDate && endDate) {
      query += ' AND DATE(invoice_date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    const [result] = await db.query(query, params);
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getSalesTrend = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    let dateFormat;
    if (groupBy === 'month') {
      dateFormat = '%Y-%m';
    } else {
      dateFormat = '%Y-%m-%d';
    }

    let query = `
      SELECT DATE(invoice_date) as date, SUM(grand_total) as revenue, COUNT(*) as invoices
      FROM invoices
      WHERE is_voided = 0
    `;
    const params = [];

    if (startDate && endDate) {
      query += ' AND DATE(invoice_date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ` GROUP BY DATE(invoice_date) ORDER BY date`;

    const [result] = await db.query(query, params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    let query = `
      SELECT p.product_name, p.sku, p.category,
             SUM(ii.quantity) as total_quantity,
             SUM(ii.line_total) as total_revenue
      FROM invoice_items ii
      JOIN invoices i ON ii.invoice_id = i.invoice_id
      JOIN products p ON ii.product_id = p.product_id
      WHERE i.is_voided = 0
    `;
    const params = [];

    if (startDate && endDate) {
      query += ' AND DATE(i.invoice_date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ` GROUP BY p.product_id ORDER BY total_revenue DESC LIMIT ?`;
    params.push(parseInt(limit));

    const [result] = await db.query(query, params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTopCustomers = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    let query = `
      SELECT c.customer_id, c.full_name, c.phone, c.email,
             COUNT(i.invoice_id) as total_invoices,
             SUM(i.grand_total) as total_spend
      FROM customers c
      JOIN invoices i ON c.customer_id = i.customer_id
      WHERE i.is_voided = 0
    `;
    const params = [];

    if (startDate && endDate) {
      query += ' AND DATE(i.invoice_date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ` GROUP BY c.customer_id ORDER BY total_spend DESC LIMIT ?`;
    params.push(parseInt(limit));

    const [result] = await db.query(query, params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const exportReport = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    let data = [];
    let headers = [];

    if (type === 'sales') {
      headers = ['Invoice Number', 'Date', 'Customer', 'Amount', 'Status'];
      const [result] = await db.query(
        `SELECT i.invoice_number, i.invoice_date, c.full_name, i.grand_total, i.payment_status
         FROM invoices i
         LEFT JOIN customers c ON i.customer_id = c.customer_id
         WHERE i.is_voided = 0 AND DATE(i.invoice_date) BETWEEN ? AND ?`,
        [startDate, endDate]
      );
      data = result.map(r => [r.invoice_number, r.invoice_date, r.full_name, r.grand_total, r.payment_status]);
    }

    const csv = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
    res.header('Content-Type', 'text/csv').send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSummary, getSalesTrend, getTopProducts, getTopCustomers, exportReport };