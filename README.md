# BillDeskPro - Web-Based Billing System

A complete billing and invoicing solution for small to medium businesses.

## Tech Stack

- **Frontend**: React 18, React Router, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.x (Xampp)

## Prerequisites

1. Node.js 20.x LTS
2. MySQL 8.x

## Setup Instructions

### 1. Database Setup

1. Open MySQL and run the database script:
```bash
mysql -u root -p < server/database.sql
```

Or import `server/database.sql` through MySQL Workbench/phpMyAdmin.

### 2. Backend Setup

```bash
cd server
npm install
```

Update `.env` with your MySQL credentials:
- `DB_PASSWORD` - Your MySQL root password

### 3. Frontend Setup

```bash
cd client
npm install
```

## Running the Application

**Start Backend:**
```bash
cd server
npm run dev
```
Server runs on http://localhost:5000

**Start Frontend:**
```bash
cd client
npm start
```
App runs on http://localhost:3000

## Default Login

- **Username**: admin
- **Password**: admin123

## Project Structure

```
BillDeskPro/
├── server/           # Express.js API
│   ├── config/       # Database config
│   ├── controllers/  # API controllers
│   ├── middleware/   # Auth middleware
│   ├── routes/       # API routes
│   └── index.js      # Entry point
├── client/           # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Features

- User Authentication (JWT)
- Product Management (CRUD)
- Customer Management (CRUD)
- Invoice Generation
- Payment Tracking
- Sales Reports with Charts
- CSV Export
- Print-ready Invoices
- Role-based Access (Admin/Cashier)
