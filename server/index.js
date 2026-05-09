const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const invoiceRoutes = require('./routes/invoices');
const reportRoutes = require('./routes/reports');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/reports', reportRoutes);

// Health check with database test
app.get('/', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ message: 'BillDeskPro API Server', database: 'connected' });
  } catch (err) {
    res.json({ message: 'BillDeskPro API Server', database: 'disconnected - ' + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});