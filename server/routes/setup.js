const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Migration endpoint - call once to create tables
router.get('/migrate', async (req, res) => {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(150) NOT NULL,
        role ENUM('admin', 'cashier') NOT NULL DEFAULT 'cashier',
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(150) NOT NULL,
        sku VARCHAR(80) NOT NULL UNIQUE,
        category VARCHAR(100) NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        stock_quantity INT UNSIGNED DEFAULT 0,
        unit_of_measure VARCHAR(50) DEFAULT 'piece',
        description TEXT,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create customers table
    await db.query(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(150),
        address TEXT,
        gstin VARCHAR(20),
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create invoices table
    await db.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        invoice_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        invoice_number VARCHAR(30) NOT NULL UNIQUE,
        customer_id INT UNSIGNED,
        created_by INT UNSIGNED,
        invoice_date DATE NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        tax_rate DECIMAL(5,2) DEFAULT 0.00,
        tax_amount DECIMAL(10,2) DEFAULT 0.00,
        discount_type ENUM('none','percent','fixed') DEFAULT 'none',
        discount_value DECIMAL(10,2) DEFAULT 0.00,
        grand_total DECIMAL(10,2) NOT NULL,
        payment_status ENUM('paid','unpaid','partial') DEFAULT 'unpaid',
        amount_paid DECIMAL(10,2) DEFAULT 0.00,
        is_voided TINYINT(1) DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create invoice_items table
    await db.query(`
      CREATE TABLE IF NOT EXISTS invoice_items (
        item_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        invoice_id INT UNSIGNED,
        product_id INT UNSIGNED,
        product_name VARCHAR(150) NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        line_total DECIMAL(10,2) NOT NULL
      )
    `);

    // Insert default admin user (password: admin123)
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('admin123', 10);
    await db.query(`
      INSERT IGNORE INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)
    `, ['admin', hash, 'Administrator', 'admin']);

    // Insert sample products
    await db.query(`
      INSERT IGNORE INTO products (product_name, sku, category, unit_price, stock_quantity, unit_of_measure) VALUES
      (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)
    `, ['Pen', 'PEN001', 'Stationery', 10.00, 100, 'piece', 'Notebook', 'NB001', 'Stationery', 50.00, 50, 'piece', 'Pencil', 'PNC001', 'Stationery', 5.00, 200, 'piece', 'Eraser', 'ERS001', 'Stationery', 3.00, 150, 'piece', 'Scale', 'SCL001', 'Stationery', 15.00, 80, 'piece']);

    // Insert sample customers
    await db.query(`
      INSERT IGNORE INTO customers (full_name, phone, email, address) VALUES
      (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)
    `, ['John Doe', '9876543210', 'john@example.com', '123 Main St', 'Jane Smith', '9876543211', 'jane@example.com', '456 Oak Ave', 'Bob Johnson', '9876543212', 'bob@example.com', '789 Pine Rd']);

    res.json({ message: 'Database migrated successfully!', status: 'success' });
  } catch (err) {
    console.error('Migration error:', err);
    res.status(500).json({ message: 'Migration failed: ' + err.message });
  }
});

module.exports = router;