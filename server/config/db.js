const mysql = require('mysql2');

// Only load .env file locally (for development)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: __dirname + '/../.env' });
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;