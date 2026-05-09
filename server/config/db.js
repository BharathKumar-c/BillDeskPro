const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Only load .env file locally (for development)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: __dirname + '/../.env' });
}

// SSL configuration for Aiven MySQL
const sslConfig = process.env.NODE_ENV === 'production' || process.env.DB_FORCE_SSL === 'true' ? {
  ca: fs.readFileSync(__dirname + '/../certs/aiven-ca.pem')
} : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig
});

const promisePool = pool.promise();

module.exports = promisePool;