# BillDeskPro User Manual

## Table of Contents

1. [Introduction](#introduction)
2. [Login & Authentication](#login--authentication)
3. [Dashboard](#dashboard)
4. [Products Management](#products-management)
5. [Customers Management](#customers-management)
6. [Invoices Management](#invoices-management)
7. [Creating a New Invoice](#creating-a-new-invoice)
8. [Viewing Invoice Details](#viewing-invoice-details)
9. [Reports & Analytics](#reports--analytics)
10. [User Roles & Permissions](#user-roles--permissions)
11. [Logging Out](#logging-out)

---

## Introduction

BillDeskPro is a web-based billing system designed for small to medium businesses. It allows you to manage products, customers, invoices, and generate business reports.

**System Requirements:**
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for cloud deployment) or local network (for local setup)

---

## Login & Authentication

### Accessing the Application

1. Open your web browser
2. Navigate to the application URL:
   - **Local:** `http://localhost:3000`
   - **Production:** `https://billdeskpro-frontend.onrender.com`

### Login Screen

The login screen is the first screen you will see when accessing the application.

![Login Screen](screenshot: login)

**Fields:**
- **Username** - Enter your username
- **Password** - Enter your password

### Default Login Credentials

| Role | Username | Password |
|------|-----------|----------|
| **Admin** | admin | admin123 |
| **Cashier** | cashier | cashier123 |

### Login Process

1. Enter your username in the "Username" field
2. Enter your password in the "Password" field
3. Click the "Login" button
4. If credentials are correct, you will be redirected to the Dashboard
5. If credentials are incorrect, an error message will be displayed

### Session Management

- The system uses JWT (JSON Web Token) for authentication
- Sessions expire after 8 hours of inactivity
- When your session expires, you will be automatically redirected to the login page

---

## Dashboard

The Dashboard is the main landing page after login. It provides a quick overview of your business.

### Accessing the Dashboard

- Click the "Dashboard" icon in the left sidebar
- Or click the logo in the top-left corner

### Dashboard Elements

#### 1. Header Section

- **Page Title:** "Dashboard"
- **Subtitle:** "Welcome back! Here's your business overview."
- **Live Data Badge:** Shows that data is current

#### 2. Statistics Cards

Four cards display key business metrics:

| Card | Description |
|------|-------------|
| **Total Revenue** | Sum of all invoice amounts (₹) |
| **Total Invoices** | Number of invoices created |
| **Total Customers** | Number of registered customers |
| **Total Products** | Number of products in inventory |

Each card shows:
- Icon representing the metric
- Metric name (label)
- Current value (in bold)

#### 3. Recent Invoices Section

Displays the 5 most recent invoices with:

- **Invoice Number** - Unique identifier
- **Customer Name** - Who the invoice is for
- **Date** - When the invoice was created
- **Amount** - Total amount (₹)
- **Status** - Payment status:
  - **Paid** (green) - Fully paid
  - **Partial** (yellow) - Partially paid
  - **Unpaid** (red) - Not yet paid

**Actions:**
- Click "View All" to see all invoices

---

## Products Management

The Products page allows you to manage your product inventory.

### Accessing Products

- Click "Products" in the left sidebar

### Products List

The page displays a table with the following columns:

| Column | Description |
|--------|-------------|
| **Product** | Product name with icon |
| **SKU** | Stock Keeping Unit (unique code) |
| **Category** | Product category |
| **Price** | Unit price (₹) |
| **Stock** | Quantity in stock + status |
| **Unit** | Unit of measurement |
| **Actions** | Edit/Delete buttons (Admin only) |

### Stock Status Indicators

- **In Stock** (green) - More than 10 units
- **Low Stock** (yellow) - Less than 10 units
- **Out of Stock** (red) - Zero units

### Adding a New Product

1. Click the **"Add Product"** button (top-right)
2. A modal form will appear with fields:
   - **Product Name** (required) - Name of the product
   - **SKU** (required) - Unique product code
   - **Category** (required) - Product category
   - **Unit Price** (required) - Price per unit (₹)
   - **Stock Quantity** (required) - Number of units
   - **Unit of Measure** - e.g., piece, kg, liter
   - **Description** - Optional product description
3. Click **"Create Product"** to save

### Editing a Product

1. Click the **Edit** (pencil) icon in the Actions column
2. The form will pre-fill with existing data
3. Modify the desired fields
4. Click **"Update Product"** to save changes

### Deleting a Product

1. Click the **Delete** (trash) icon in the Actions column
2. A confirmation modal will appear
3. Click **"Delete"** to confirm (Admin only)
   - This action cannot be undone

### Searching Products

- Use the search bar to find products by name, SKU, or category
- Results update automatically as you type

### Pagination

- Use "Previous" and "Next" buttons to navigate pages
- 10 products are shown per page

---

## Customers Management

The Customers page allows you to manage your customer database.

### Accessing Customers

- Click "Customers" in the left sidebar

### Customers List

The page displays a table with the following columns:

| Column | Description |
|--------|-------------|
| **Customer** | Name with avatar |
| **Contact** | Phone number |
| **Email** | Email address |
| **Address** | Physical address |
| **GSTIN** | GST Identification Number (if available) |
| **Actions** | Edit/Delete buttons |

### Adding a New Customer

1. Click the **"Add Customer"** button (top-right)
2. A modal form will appear with fields:
   - **Full Name** (required) - Customer's name
   - **Phone** (required) - Contact number
   - **Email** - Email address (optional)
   - **GSTIN** - GST number (optional)
   - **Address** - Physical address (optional)
3. Click **"Create Customer"** to save

### Editing a Customer

1. Click the **Edit** (pencil) icon in the Actions column
2. The form will pre-fill with existing data
3. Modify the desired fields
4. Click **"Update Customer"** to save changes

### Deleting a Customer

1. Click the **Delete** (trash) icon in the Actions column
2. A confirmation modal will appear
3. Click **"Delete"** to confirm (Admin only)
   - This action cannot be undone

### Searching Customers

- Use the search bar to find customers by name, phone, or email
- Results update automatically as you type

---

## Invoices Management

The Invoices page allows you to view and manage all invoices.

### Accessing Invoices

- Click "Invoices" in the left sidebar

### Invoices List

The page displays a table with the following columns:

| Column | Description |
|--------|-------------|
| **Invoice** | Invoice number with icon |
| **Customer** | Customer name |
| **Date** | Invoice creation date |
| **Amount** | Total amount (₹) |
| **Status** | Payment status |
| **Actions** | View/Void buttons |

### Invoice Statuses

| Status | Color | Description |
|--------|-------|-------------|
| **Paid** | Green | Invoice fully paid |
| **Partial** | Yellow | Partially paid |
| **Unpaid** | Red | Not yet paid |

### Creating a New Invoice

1. Click the **"New Invoice"** button (top-right)
2. You will be redirected to the New Invoice page
3. See the [Creating a New Invoice](#creating-a-new-invoice) section for details

### Viewing Invoice Details

1. Click the **View** (eye) icon in the Actions column
2. You will see the complete invoice details
3. See the [Viewing Invoice Details](#viewing-invoice-details) section for details

### Voiding an Invoice

1. Click the **Void** (trash) icon in the Actions column (Admin only)
2. A confirmation modal will appear
3. Click **"Void Invoice"** to confirm
   - This marks the invoice as void/cancelled
   - This action cannot be undone

### Filtering Invoices

- Use the status dropdown to filter by:
  - All Status
  - Paid
  - Unpaid
  - Partial

### Searching Invoices

- Use the search bar to find invoices by number or customer name
- Results update automatically as you type

---

## Creating a New Invoice

The New Invoice page allows you to create and save new invoices.

### Accessing New Invoice

- Click "New Invoice" from the Invoices page or sidebar

### Step-by-Step Process

#### Step 1: Select Invoice Date

1. Click the date field
2. Select the invoice date (default is today's date)

#### Step 2: Select Customer

1. Click the "Customer" dropdown
2. Select an existing customer from the list
   - If no customers exist, you need to add one first (see Customers section)

#### Step 3: Add Products

1. Below "Add Products", you will see a list of available products
2. Click on a product to add it to the invoice
3. The product will appear in the "Invoice Items" table
4. Repeat for all products needed

#### Step 4: Configure Invoice Items

For each item in the invoice:

| Field | Description |
|-------|-------------|
| **Product** | Product name (read-only) |
| **Price** | Unit price (₹) |
| **Qty** | Quantity - change as needed |
| **Total** | Price × Quantity |
| **Action** | Remove item button |

#### Step 5: Apply Tax

1. Enter the tax rate percentage in the "Tax Rate" field
2. Tax will be calculated automatically

#### Step 6: Apply Discount (Optional)

1. Select discount type:
   - **None** - No discount
   - **Percentage** - Discount as a percentage
   - **Fixed Amount** - Discount as a fixed amount
2. Enter the discount value

#### Step 7: Add Notes (Optional)

1. Enter any additional notes or terms in the "Notes" field

#### Step 8: Review Totals

Review the calculated totals:

| Line Item | Description |
|-----------|-------------|
| **Subtotal** | Sum of all item totals |
| **Tax** | Tax amount (Subtotal × Tax Rate) |
| **Discount** | Discount amount |
| **Grand Total** | Subtotal + Tax - Discount |

#### Step 9: Create Invoice

1. Click **"Create Invoice"** button
2. You will be redirected to the Invoices list
3. The new invoice will appear at the top of the list

---

## Viewing Invoice Details

The Invoice Detail page shows the complete information about a specific invoice.

### Accessing Invoice Details

- Click the "View" icon on any invoice in the Invoices list

### Invoice Information Sections

#### 1. Invoice Header

- **Invoice Number** - Unique identifier
- **Invoice Date** - When created
- **Status** - Payment status (Paid/Partial/Unpaid)

#### 2. Customer Information

- **Name** - Customer's full name
- **Phone** - Contact number
- **Address** - Physical address
- **GSTIN** - GST number (if available)

#### 3. Invoice Items Table

| Column | Description |
|--------|-------------|
| **#** | Item number |
| **Product** | Product name |
| **Price** | Unit price (₹) |
| **Qty** | Quantity |
| **Total** | Line total (₹) |

#### 4. Totals Section

| Line Item | Description |
|-----------|-------------|
| **Subtotal** | Sum of all items |
| **Tax** | Tax amount |
| **Discount** | Discount applied |
| **Grand Total** | Amount due |

#### 5. Notes

- Any additional notes or terms

### Actions on Invoice Detail

- **Print** - Print the invoice (if enabled)
- **Back** - Return to invoices list
- **Void** - Cancel the invoice (Admin only)

---

## Reports & Analytics

The Reports page provides business insights and analytics.

### Accessing Reports

- Click "Reports" in the left sidebar

### Report Sections

#### 1. Header

- **Page Title:** "Reports & Analytics"
- **Subtitle:** "Track your business performance"
- **Export Button:** Download data as CSV

#### 2. Date Filters

Select a date range for reports:

- **Start Date** - Beginning of period
- **End Date** - End of period
- Leave empty for all-time data

#### 3. Summary Statistics

Four cards showing:

| Card | Description |
|------|-------------|
| **Total Revenue** | Sum of all invoice amounts |
| **Total Invoices** | Number of invoices |
| **Paid Amount** | Total payments received |
| **Unpaid Amount** | Total outstanding payments |

#### 4. Sales Trend Chart

A line chart showing:

- **X-Axis:** Date
- **Y-Axis:** Revenue (₹)
- **Line:** Daily revenue trend

This helps visualize revenue patterns over time.

#### 5. Top Products Table

Shows best-selling products by revenue:

| Column | Description |
|--------|-------------|
| **Rank** | Position (with trophy for top 3) |
| **Product** | Product name |
| **Qty** | Units sold |
| **Revenue** | Total revenue (₹) |

A progress bar shows relative performance.

#### 6. Top Customers Table

Shows highest-spending customers:

| Column | Description |
|--------|-------------|
| **Rank** | Position (with trophy for top 3) |
| **Customer** | Customer name |
| **Invoices** | Number of invoices |
| **Total Spend** | Total amount spent (₹) |

### Exporting Data

1. Click the **"Export CSV"** button
2. A CSV file will be downloaded
3. Open in Excel or any spreadsheet application

---

## User Roles & Permissions

BillDeskPro has two user roles with different permissions.

### Admin Role

**Username:** `admin`  
**Password:** `admin123`

**Permissions:**
- View Dashboard
- Manage Products (Create, Read, Update, Delete)
- Manage Customers (Create, Read, Update, Delete)
- Create Invoices
- View Invoice Details
- Void Invoices (cancel)
- View Reports
- Export Reports

### Cashier Role

**Username:** `cashier`  
**Password:** `cashier123`

**Permissions:**
- View Dashboard
- View Products (Read only - no add/edit/delete)
- Manage Customers (Create, Read, Update only - no delete)
- Create Invoices
- View Invoice Details
- View Reports
- Export Reports

### Role-Based UI Differences

| Feature | Admin | Cashier |
|---------|-------|---------|
| Add Product button | Visible | Hidden |
| Edit Product | Available | Not available |
| Delete Product | Available | Not available |
| Delete Customer | Available | Not available |
| Void Invoice | Available | Not available |

---

## Logging Out

To log out of the application:

1. Click your username in the top-right corner
2. Click the "Logout" button
3. You will be redirected to the login page

### Session Expiry

- If you are inactive for 8 hours, you will be automatically logged out
- A message will indicate that your session has expired
- Simply log in again to continue

---

## Support

For technical support or questions:

- Check the README.md file for setup instructions
- Review error messages for troubleshooting tips
- Contact your system administrator

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Search | Type in search field |
| Submit Form | Enter key |
| Close Modal | Escape key |

---

*Document Version: 1.0*  
*Last Updated: May 2026*