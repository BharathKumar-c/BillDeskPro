# PROJECT REQUIREMENTS DOCUMENT

## Web-Based Billing System

| Field            | Details                                                           |
| ---------------- | ----------------------------------------------------------------- |
| **Version**      | 1.0.0                                                             |
| **Date**         | May 2026                                                          |
| **Status**       | Draft                                                             |
| **Tech Stack**   | React \| Node.js \| Express.js \| MySQL                           |
| **Prepared For** | Gowtham \| BCA-VI(SEM) \| SRM Institute of Science and Technology |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Scope of Work](#3-scope-of-work)
4. [Functional Requirements](#4-functional-requirements)
   - 4.1 Authentication Module
   - 4.2 Product Management Module
   - 4.3 Customer Management Module
   - 4.4 Billing & Invoice Module
   - 4.5 Reports & Analytics Module
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [System Architecture](#6-system-architecture)
7. [Technology Stack](#7-technology-stack)
8. [Database Design](#8-database-design)
9. [API Endpoints](#9-api-endpoints)
10. [User Roles & Permissions](#10-user-roles--permissions)
11. [UI/UX Requirements](#11-uiux-requirements)
12. [Security Requirements](#12-security-requirements)
13. [Project Milestones](#13-project-milestones)
14. [Assumptions & Constraints](#14-assumptions--constraints)
15. [Future Enhancements](#15-future-enhancements)
16. [Glossary](#16-glossary)

---

## 1. Executive Summary

This Project Requirements Document (PRD) defines the full scope, functional and non-functional requirements, architecture, database design, and implementation plan for a **Web-Based Billing System**. The system is designed to automate and streamline billing and sales operations for small to medium-sized businesses, replacing error-prone manual processes with a fast, accurate, and user-friendly digital solution.

The application will be built using a modern JavaScript full-stack: **React** for the frontend, **Node.js with Express.js** as the backend REST API server, and **MySQL** as the relational database. This stack ensures scalability, maintainability, and ease of deployment across modern operating systems and browsers.

---

## 2. Project Overview

### 2.1 Purpose

The Web-Based Billing System aims to provide businesses with an efficient, centralized platform to manage all billing-related activities. It eliminates manual paperwork, reduces calculation errors, and enables fast bill generation and reporting.

### 2.2 Problem Statement

Manual billing systems suffer from several critical drawbacks that hinder business efficiency:

- Time-consuming bill creation by hand
- High risk of calculation errors
- Difficulty in maintaining and retrieving historical records
- Risk of data loss due to physical record storage
- Slow bill generation causing customer wait times
- No consolidated reporting or analytics

### 2.3 Proposed Solution

The proposed system provides:

- Fast, automated bill generation with real-time calculation
- Centralized product and customer management
- Persistent, secure data storage in a MySQL relational database
- Sales report generation with filters by date and category
- Role-based access for administrators and staff
- A responsive React-based UI accessible from any modern browser

### 2.4 Goals & Objectives

1. Automate billing operations to reduce human error.
2. Eliminate manual paperwork and physical records.
3. Generate accurate invoices instantly.
4. Maintain comprehensive product and customer records.
5. Improve transaction speed and operational efficiency.
6. Store all billing records securely and make them easily retrievable.
7. Provide analytical reports for business insight.

---

## 3. Scope of Work

### 3.1 In Scope

- User authentication (login/logout) with session management
- Product CRUD (Create, Read, Update, Delete) management
- Customer CRUD management
- Invoice/Bill generation with itemized line items
- Sales reporting and analytics dashboard
- Role-based access control (Admin, Cashier)
- REST API backend with Express.js
- MySQL database schema design and migrations
- Responsive React frontend with routing and state management

### 3.2 Out of Scope

- Mobile native applications (iOS / Android)
- Online payment gateway integration _(planned as future enhancement)_
- Multi-branch / multi-tenant support
- Barcode scanner hardware integration
- Cloud hosting and DevOps pipeline configuration

---

## 4. Functional Requirements

### 4.1 Authentication Module

#### 4.1.1 User Login

- The system shall provide a login page with username and password fields.
- Credentials shall be validated against the `users` table in the MySQL database.
- On successful login, a JSON Web Token (JWT) shall be issued and stored client-side.
- The JWT shall have a configurable expiry (default: **8 hours**).
- Invalid credentials shall display a clear, non-revealing error message.
- After **5 consecutive failed attempts**, the account shall be temporarily locked for 15 minutes.

#### 4.1.2 User Logout

- A logout button shall be accessible from all authenticated pages.
- On logout, the JWT shall be invalidated client-side and the user redirected to the login page.

#### 4.1.3 Password Management

- Passwords shall be stored as **bcrypt hashes** (minimum 10 rounds) in the database.
- Admin users shall be able to reset staff passwords from the Admin panel.

---

### 4.2 Product Management Module

#### 4.2.1 Add Product

Authorized users shall add new products with the following fields:

- Product Name _(required, max 150 characters)_
- Product Code / SKU _(required, unique)_
- Category _(required)_
- Unit Price _(required, decimal, 2 decimal places)_
- Stock Quantity _(required, integer)_
- Unit of Measure _(e.g., piece, kg, litre)_
- Description _(optional, max 500 characters)_

The system shall validate all fields before submission and display inline errors.

#### 4.2.2 View Products

- A paginated, searchable product list shall display all active products.
- Users shall be able to search by product name or SKU.
- Users shall be able to filter by category.
- The list shall display: Name, SKU, Category, Price, Stock.

#### 4.2.3 Update Product

- Authorized users shall edit any product field.
- Changes shall be saved with a timestamp in the database.

#### 4.2.4 Delete Product

- Admin users shall **soft-delete** products (mark as inactive).
- Deleted products shall not appear in new bills but shall be preserved in historical invoices.

---

### 4.3 Customer Management Module

#### 4.3.1 Add Customer

Users shall create customer records with:

- Full Name _(required)_
- Phone Number _(required, validated format)_
- Email Address _(optional, validated format)_
- Address _(optional)_
- GSTIN / Tax ID _(optional)_

#### 4.3.2 View Customers

- A paginated, searchable customer list shall display all customers.
- Search by name or phone number shall be supported.

#### 4.3.3 Update Customer

- All customer fields shall be editable.

#### 4.3.4 Delete Customer

- Admin users shall soft-delete customers.
- Deleted customers shall remain linked to their historical billing records.

#### 4.3.5 Customer Billing History

- Users shall view a complete billing history for any customer from the customer detail page.

---

### 4.4 Billing & Invoice Module

#### 4.4.1 Create Bill

Users shall create a new bill by:

- Selecting a customer from a search dropdown _(or adding a walk-in customer name)_
- Adding one or more products with quantity
- The system shall auto-calculate: unit price, line total, subtotal, tax, and grand total
- Tax rate shall be configurable (GST, VAT, or custom %)
- Discount (percentage or fixed amount) shall be applicable per bill
- Bill number shall be auto-generated in sequence (e.g., `INV-2026-0001`)

#### 4.4.2 View Bills

- A paginated list of all invoices shall be available, sorted by date descending.
- Filters shall include: date range, customer name, and bill status.

#### 4.4.3 Bill Detail & Print

Each invoice shall have a printable detail view with:

- Business name and logo _(configurable in settings)_
- Invoice number, date, and due date
- Customer details
- Itemized product list with quantity, unit price, and line total
- Subtotal, tax breakdown, discount, and grand total
- Payment status (Paid / Unpaid / Partial)
- The print layout shall be formatted for A4/Letter paper using CSS `@media print`

#### 4.4.4 Update Bill Status

- Users shall update the payment status of a bill (Paid, Unpaid, Partial).
- A payment amount field shall record the amount received.

#### 4.4.5 Delete / Void Bill

- Admin users shall void a bill (mark as cancelled), preserving the record.

---

### 4.5 Reports & Analytics Module

#### 4.5.1 Sales Summary Report

The report shall show total sales, total revenue, and number of transactions for a selected date range.

#### 4.5.2 Daily / Monthly Sales Chart

A bar or line chart shall visualize revenue trends over time.

#### 4.5.3 Product Sales Report

A ranked table of most-sold products by quantity and revenue.

#### 4.5.4 Customer Report

A list of top customers by total spend.

#### 4.5.5 Export

Reports shall be exportable as CSV.

---

## 5. Non-Functional Requirements

| Category            | Metric           | Requirement                                                                               |
| ------------------- | ---------------- | ----------------------------------------------------------------------------------------- |
| **Performance**     | API Response     | All API endpoints shall respond within 500ms under normal load (< 50 concurrent users).   |
| **Scalability**     | Concurrent Users | The system shall support at least 50 concurrent users without performance degradation.    |
| **Availability**    | Uptime           | 99% uptime during business hours (8 AM – 10 PM).                                          |
| **Security**        | Auth             | All authenticated routes shall require a valid JWT. Passwords stored as bcrypt hashes.    |
| **Usability**       | UI               | The UI shall be operable by a non-technical user with less than 30 minutes of onboarding. |
| **Maintainability** | Code Quality     | Backend code shall follow MVC pattern. Frontend shall use component-based architecture.   |
| **Browser Support** | Compatibility    | Chrome 100+, Firefox 100+, Edge 100+, Safari 15+.                                         |
| **Data Integrity**  | Transactions     | Billing creation shall use MySQL transactions to ensure data consistency.                 |

---

## 6. System Architecture

The system follows a **three-tier client-server architecture**:

### 6.1 Presentation Tier (Frontend)

- React.js single-page application (SPA)
- React Router for client-side navigation
- Axios for HTTP API calls
- Context API or Redux for global state management
- Runs in the user's browser

### 6.2 Application Tier (Backend)

- Node.js runtime environment
- Express.js REST API server
- JWT-based authentication middleware
- Input validation middleware (`express-validator`)
- MVC architectural pattern (Models, Controllers, Routes)

### 6.3 Data Tier (Database)

- MySQL 8.x relational database
- `mysql2` Node.js driver with connection pooling
- Normalized schema (3NF)
- Referential integrity enforced via foreign key constraints

### 6.4 Architecture Diagram

```
  [ Browser ]  <──────────────>  [ React SPA ]
       │                               │
       └───────────  HTTP/REST  ───────┘
                         │
            [ Express.js API Server (Node.js) ]
                         │
              ───── SQL Queries ─────
                         │
               [ MySQL 8.x Database ]
```

---

## 7. Technology Stack

| Layer         | Technology                | Version  | Purpose                         |
| ------------- | ------------------------- | -------- | ------------------------------- |
| **Frontend**  | React.js                  | 18.x     | UI component framework          |
| **Frontend**  | React Router              | 6.x      | Client-side routing             |
| **Frontend**  | Axios                     | 1.x      | HTTP client for API calls       |
| **Frontend**  | React Query / Context API | 5.x      | State & server state management |
| **Backend**   | Node.js                   | 20.x LTS | JavaScript runtime              |
| **Backend**   | Express.js                | 4.x      | REST API framework              |
| **Backend**   | jsonwebtoken              | 9.x      | JWT auth token issuance         |
| **Backend**   | bcryptjs                  | 2.x      | Password hashing                |
| **Backend**   | express-validator         | 7.x      | Request validation              |
| **Backend**   | cors                      | 2.x      | Cross-Origin Resource Sharing   |
| **Backend**   | dotenv                    | 16.x     | Environment variable management |
| **Database**  | MySQL                     | 8.x      | Relational database             |
| **Database**  | mysql2                    | 3.x      | Node.js MySQL driver            |
| **Dev Tools** | nodemon                   | 3.x      | Auto-restart dev server         |
| **Dev Tools** | ESLint + Prettier         | Latest   | Code quality & formatting       |

---

## 8. Database Design

The MySQL database follows **Third Normal Form (3NF)**. Database name: `billing_system_db`.

### 8.1 `users` Table

| Column          | Data Type               | Constraints        | Description            |
| --------------- | ----------------------- | ------------------ | ---------------------- |
| `user_id`       | INT UNSIGNED            | PK, AUTO_INCREMENT | Primary key            |
| `username`      | VARCHAR(100)            | NOT NULL, UNIQUE   | Login username         |
| `password_hash` | VARCHAR(255)            | NOT NULL           | bcrypt hashed password |
| `full_name`     | VARCHAR(150)            | NOT NULL           | Display name of user   |
| `role`          | ENUM('admin','cashier') | NOT NULL           | User role for RBAC     |
| `is_active`     | TINYINT(1)              | DEFAULT 1          | Soft delete flag       |
| `created_at`    | TIMESTAMP               | DEFAULT NOW()      | Record creation time   |
| `updated_at`    | TIMESTAMP               | ON UPDATE NOW()    | Last update time       |

### 8.2 `products` Table

| Column            | Data Type     | Constraints        | Description                  |
| ----------------- | ------------- | ------------------ | ---------------------------- |
| `product_id`      | INT UNSIGNED  | PK, AUTO_INCREMENT | Primary key                  |
| `product_name`    | VARCHAR(150)  | NOT NULL           | Name of the product          |
| `sku`             | VARCHAR(80)   | NOT NULL, UNIQUE   | Stock Keeping Unit code      |
| `category`        | VARCHAR(100)  | NOT NULL           | Product category             |
| `unit_price`      | DECIMAL(10,2) | NOT NULL           | Selling price per unit       |
| `stock_quantity`  | INT UNSIGNED  | DEFAULT 0          | Current stock level          |
| `unit_of_measure` | VARCHAR(50)   | DEFAULT 'piece'    | Unit (piece, kg, litre…)     |
| `description`     | TEXT          | NULL               | Optional product description |
| `is_active`       | TINYINT(1)    | DEFAULT 1          | Soft delete flag             |
| `created_at`      | TIMESTAMP     | DEFAULT NOW()      | Record creation time         |

### 8.3 `customers` Table

| Column        | Data Type    | Constraints        | Description                     |
| ------------- | ------------ | ------------------ | ------------------------------- |
| `customer_id` | INT UNSIGNED | PK, AUTO_INCREMENT | Primary key                     |
| `full_name`   | VARCHAR(150) | NOT NULL           | Customer full name              |
| `phone`       | VARCHAR(20)  | NOT NULL           | Contact phone number            |
| `email`       | VARCHAR(150) | NULL               | Customer email address          |
| `address`     | TEXT         | NULL               | Customer address                |
| `gstin`       | VARCHAR(20)  | NULL               | GST / Tax identification number |
| `is_active`   | TINYINT(1)   | DEFAULT 1          | Soft delete flag                |
| `created_at`  | TIMESTAMP    | DEFAULT NOW()      | Record creation time            |

### 8.4 `invoices` Table

| Column           | Data Type                       | Constraints        | Description                    |
| ---------------- | ------------------------------- | ------------------ | ------------------------------ |
| `invoice_id`     | INT UNSIGNED                    | PK, AUTO_INCREMENT | Primary key                    |
| `invoice_number` | VARCHAR(30)                     | NOT NULL, UNIQUE   | Auto-generated (INV-YYYY-NNNN) |
| `customer_id`    | INT UNSIGNED                    | FK → customers     | Linked customer                |
| `created_by`     | INT UNSIGNED                    | FK → users         | Staff who created the bill     |
| `invoice_date`   | DATE                            | NOT NULL           | Date of the invoice            |
| `subtotal`       | DECIMAL(10,2)                   | NOT NULL           | Sum before tax and discount    |
| `tax_rate`       | DECIMAL(5,2)                    | DEFAULT 0.00       | Tax percentage applied         |
| `tax_amount`     | DECIMAL(10,2)                   | DEFAULT 0.00       | Calculated tax amount          |
| `discount_type`  | ENUM('none','percent','fixed')  | DEFAULT 'none'     | Type of discount               |
| `discount_value` | DECIMAL(10,2)                   | DEFAULT 0.00       | Discount value                 |
| `grand_total`    | DECIMAL(10,2)                   | NOT NULL           | Final payable amount           |
| `payment_status` | ENUM('paid','unpaid','partial') | DEFAULT 'unpaid'   | Current payment status         |
| `amount_paid`    | DECIMAL(10,2)                   | DEFAULT 0.00       | Amount already received        |
| `is_voided`      | TINYINT(1)                      | DEFAULT 0          | Soft cancel flag               |
| `notes`          | TEXT                            | NULL               | Optional notes on the invoice  |
| `created_at`     | TIMESTAMP                       | DEFAULT NOW()      | Record creation time           |

### 8.5 `invoice_items` Table

| Column         | Data Type     | Constraints        | Description                   |
| -------------- | ------------- | ------------------ | ----------------------------- |
| `item_id`      | INT UNSIGNED  | PK, AUTO_INCREMENT | Primary key                   |
| `invoice_id`   | INT UNSIGNED  | FK → invoices      | Parent invoice reference      |
| `product_id`   | INT UNSIGNED  | FK → products      | Product reference             |
| `product_name` | VARCHAR(150)  | NOT NULL           | Snapshot of name at sale time |
| `unit_price`   | DECIMAL(10,2) | NOT NULL           | Price snapshot at sale time   |
| `quantity`     | DECIMAL(10,2) | NOT NULL           | Quantity sold                 |
| `line_total`   | DECIMAL(10,2) | NOT NULL           | unit_price × quantity         |

---

## 9. API Endpoints

> All API routes are prefixed with `/api/v1`.  
> Protected routes require the `Authorization: Bearer <token>` header.

### 9.1 Authentication Routes

| Method | Endpoint       | Auth | Description                                    |
| ------ | -------------- | ---- | ---------------------------------------------- |
| POST   | `/auth/login`  | No   | Authenticate user, return JWT                  |
| POST   | `/auth/logout` | Yes  | Invalidate session (client-side token removal) |
| GET    | `/auth/me`     | Yes  | Get current authenticated user details         |

### 9.2 Product Routes

| Method | Endpoint        | Auth  | Description                               |
| ------ | --------------- | ----- | ----------------------------------------- |
| GET    | `/products`     | Yes   | Get paginated list of all active products |
| GET    | `/products/:id` | Yes   | Get single product by ID                  |
| POST   | `/products`     | Admin | Create a new product                      |
| PUT    | `/products/:id` | Admin | Update an existing product                |
| DELETE | `/products/:id` | Admin | Soft-delete a product                     |

### 9.3 Customer Routes

| Method | Endpoint         | Auth  | Description                                |
| ------ | ---------------- | ----- | ------------------------------------------ |
| GET    | `/customers`     | Yes   | Get paginated list of all active customers |
| GET    | `/customers/:id` | Yes   | Get single customer with billing history   |
| POST   | `/customers`     | Yes   | Create a new customer                      |
| PUT    | `/customers/:id` | Yes   | Update customer details                    |
| DELETE | `/customers/:id` | Admin | Soft-delete a customer                     |

### 9.4 Invoice Routes

| Method | Endpoint                | Auth  | Description                                 |
| ------ | ----------------------- | ----- | ------------------------------------------- |
| GET    | `/invoices`             | Yes   | Get paginated invoices with filters         |
| GET    | `/invoices/:id`         | Yes   | Get invoice detail with line items          |
| POST   | `/invoices`             | Yes   | Create new invoice with items (transaction) |
| PATCH  | `/invoices/:id/payment` | Yes   | Update payment status and amount            |
| PATCH  | `/invoices/:id/void`    | Admin | Void / cancel an invoice                    |

### 9.5 Reports Routes

| Method | Endpoint                 | Auth  | Description                      |
| ------ | ------------------------ | ----- | -------------------------------- |
| GET    | `/reports/summary`       | Admin | Sales summary for a date range   |
| GET    | `/reports/sales-trend`   | Admin | Daily/monthly revenue trend data |
| GET    | `/reports/top-products`  | Admin | Top products by revenue          |
| GET    | `/reports/top-customers` | Admin | Top customers by spend           |
| GET    | `/reports/export`        | Admin | Export report as CSV             |

---

## 10. User Roles & Permissions

| Feature / Action | Login       | Products  | Customers    | Billing            | Reports     | User Mgmt |
| ---------------- | ----------- | --------- | ------------ | ------------------ | ----------- | --------- |
| **Admin**        | Full        | Full CRUD | Full CRUD    | Create, View, Void | Full Access | Full      |
| **Cashier**      | Own account | View only | Create, View | Create, View, Pay  | No access   | No access |

---

## 11. UI/UX Requirements

### 11.1 General

- The application shall use a clean, professional **sidebar navigation** layout.
- Primary color: `#1E3A5F` (dark navy). Accent: `#2E75B6` (blue). Background: `#F5F8FB` (light gray).
- All data tables shall support sorting by column header click.
- All forms shall display inline validation errors before submission.
- Success and error feedback shall be shown via **toast notifications**.

### 11.2 Key Pages / Screens

1. **Login Page** – Centered card with username/password and login button.
2. **Dashboard** – Summary cards (Total Revenue, Total Invoices, Total Customers, Total Products) + recent invoices table + revenue chart.
3. **Products Page** – Searchable, sortable table with Add / Edit / Delete actions.
4. **Customers Page** – Searchable table with Add / Edit / View History actions.
5. **New Invoice Page** – Customer selector, product add-row table, auto-calculated totals, tax/discount inputs.
6. **Invoice List Page** – Filterable, sortable invoice list with Print / View / Void actions.
7. **Invoice Detail / Print View** – Formatted, print-ready invoice layout.
8. **Reports Page** – Date range filter, summary KPI cards, trend charts, top product/customer tables.
9. **User Management Page** _(Admin only)_ – Manage users and roles.

---

## 12. Security Requirements

- All API endpoints (except login) shall require a valid JWT in the `Authorization` header.
- The JWT secret shall be stored in a `.env` file and never committed to version control.
- Passwords shall never be stored or transmitted in plain text.
- All database queries shall use **parameterized statements** to prevent SQL injection.
- CORS shall be configured to allow only the frontend origin.
- HTTP security headers (`Helmet.js`) shall be applied to all API responses.
- Input sanitization shall be applied to all user-submitted data via `express-validator`.
- Sensitive `.env` files and `node_modules` shall be included in `.gitignore`.

---

## 13. Project Milestones

| #   | Phase                        | Deliverables                                                          | Duration  |
| --- | ---------------------------- | --------------------------------------------------------------------- | --------- |
| 1   | **Project Setup**            | Repo init, folder structure, DB creation, env config, npm installs    | 1 week    |
| 2   | **Database & API – Auth**    | MySQL schema, users table, login/logout endpoints, JWT middleware     | 1 week    |
| 3   | **Product & Customer APIs**  | All CRUD endpoints for products and customers with validation         | 1 week    |
| 4   | **Billing & Invoice API**    | Invoice creation with transactions, line items, payment updates, void | 1.5 weeks |
| 5   | **Reports API**              | Summary, trend, top products, top customers, CSV export               | 1 week    |
| 6   | **React Frontend – Core**    | Login, Dashboard, Product pages, Customer pages                       | 2 weeks   |
| 7   | **React Frontend – Billing** | New invoice page, invoice list, invoice detail/print view             | 1.5 weeks |
| 8   | **Reports & Admin UI**       | Reports page with charts, User management page                        | 1 week    |
| 9   | **Testing & Bug Fixes**      | End-to-end testing, edge case handling, UI polish                     | 1 week    |
| 10  | **Documentation & Handover** | README, API docs, deployment guide, final demo                        | 0.5 weeks |

**Total Estimated Duration: ~12 weeks**

---

## 14. Assumptions & Constraints

### 14.1 Assumptions

- The development machine has Node.js 20.x LTS and MySQL 8.x installed.
- The application will be deployed on a single local server or low-cost VPS initially.
- All business transactions are in a single currency.
- Only one business/branch is managed per installation.
- The admin will pre-configure tax rates before going live.

### 14.2 Constraints

- No real-time synchronization between multiple simultaneous users (no WebSockets in v1).
- No mobile application in the current scope.
- No automated backup solution (manual MySQL dump recommended).

---

## 15. Future Enhancements

- Online payment gateway integration (Razorpay, Stripe, PayPal)
- Cloud database hosting (AWS RDS, PlanetScale)
- Progressive Web App (PWA) for mobile browser support
- Barcode / QR code scanning for fast product lookup
- Multi-branch / multi-location support
- Automated daily email reports to admin
- SMS notification to customer on invoice creation
- Inventory low-stock alert system
- User activity audit log

---

## 16. Glossary

| Term            | Definition                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| **API**         | Application Programming Interface – a set of endpoints that allow the frontend to communicate with the backend.      |
| **JWT**         | JSON Web Token – a compact, signed token used for stateless authentication.                                          |
| **REST**        | Representational State Transfer – an architectural style for designing networked APIs.                               |
| **CRUD**        | Create, Read, Update, Delete – the four basic database operations.                                                   |
| **SPA**         | Single Page Application – a web app that loads a single HTML page and updates dynamically without full page reloads. |
| **SKU**         | Stock Keeping Unit – a unique identifier for each distinct product.                                                  |
| **RBAC**        | Role-Based Access Control – restricting system access based on user roles.                                           |
| **3NF**         | Third Normal Form – a database normalization standard that eliminates transitive dependencies.                       |
| **bcrypt**      | A password hashing algorithm designed to be computationally expensive and resistant to brute-force attacks.          |
| **GSTIN**       | Goods and Services Tax Identification Number – an Indian tax registration number.                                    |
| **Soft Delete** | A deletion strategy where records are marked as inactive rather than physically removed, preserving data integrity.  |

---

_End of Project Requirements Document | Version 1.0.0 | May 2026_
