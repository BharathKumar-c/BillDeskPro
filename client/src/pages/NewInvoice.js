import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const NewInvoice = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([]);
  const [taxRate, setTaxRate] = useState(0);
  const [discountType, setDiscountType] = useState('none');
  const [discountValue, setDiscountValue] = useState(0);
  const [notes, setNotes] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [custRes, prodRes] = await Promise.all([api.get('/customers?limit=100'), api.get('/products?limit=100')]);
    setCustomers(custRes.data.customers);
    setProducts(prodRes.data.products);
  };

  const addItem = (product) => {
    if (items.find(i => i.product_id === product.product_id)) return;
    setItems([...items, { product_id: product.product_id, product_name: product.product_name, unit_price: product.unit_price, quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const discountAmount = discountType === 'percent' ? subtotal * (discountValue / 100) : discountType === 'fixed' ? discountValue : 0;
  const grandTotal = subtotal + taxAmount - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || items.length === 0) return alert('Please select customer and add items');
    try {
      await api.post('/invoices', { customer_id: selectedCustomer, invoice_date: invoiceDate, items, tax_rate: taxRate, discount_type: discountType, discount_value: discountValue, notes });
      navigate('/invoices');
    } catch (err) { alert('Error creating invoice'); }
  };

  return (
    <div>
      <h1 style={styles.pageTitle}>New Invoice</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.field}>
            <label>Invoice Date</label>
            <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label>Customer</label>
            <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} style={styles.input} required>
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.full_name}</option>)}
            </select>
          </div>
        </div>

        <div style={styles.section}>
          <h3>Add Products</h3>
          <div style={styles.productList}>
            {products.map(p => (
              <button type="button" key={p.product_id} onClick={() => addItem(p)} style={styles.productBtn}>
                {p.product_name} - ₹{p.unit_price}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3>Invoice Items</h3>
          <table style={styles.table}>
            <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.product_name}</td>
                  <td>₹{item.unit_price}</td>
                  <td><input type="number" min="1" value={item.quantity} onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value))} style={styles.qtyInput} /></td>
                  <td>₹{(item.unit_price * item.quantity).toFixed(2)}</td>
                  <td><button type="button" onClick={() => removeItem(idx)} style={styles.removeBtn}>X</button></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="5" style={styles.empty}>No items added</td></tr>}
            </tbody>
          </table>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label>Tax Rate (%)</label>
            <input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value))} style={styles.input} />
          </div>
          <div style={styles.field}>
            <label>Discount Type</label>
            <select value={discountType} onChange={e => setDiscountType(e.target.value)} style={styles.input}>
              <option value="none">None</option>
              <option value="percent">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <div style={styles.field}>
            <label>Discount Value</label>
            <input type="number" value={discountValue} onChange={e => setDiscountValue(parseFloat(e.target.value))} style={styles.input} />
          </div>
        </div>

        <div style={styles.totals}>
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Tax: ₹{taxAmount.toFixed(2)}</p>
          <p>Discount: -₹{discountAmount.toFixed(2)}</p>
          <p style={styles.grandTotal}>Grand Total: ₹{grandTotal.toFixed(2)}</p>
        </div>

        <div style={styles.field}>
          <label>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} style={styles.textarea} />
        </div>

        <div style={styles.actions}>
          <button type="button" onClick={() => navigate('/invoices')} style={styles.cancelBtn}>Cancel</button>
          <button type="submit" style={styles.submitBtn}>Create Invoice</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  pageTitle: { fontSize: '28px', fontWeight: 'bold', color: '#1E3A5F', marginBottom: '30px' },
  form: { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  row: { display: 'flex', gap: '20px', marginBottom: '20px' },
  field: { flex: 1 },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' },
  section: { marginBottom: '20px' },
  productList: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  productBtn: { background: '#f5f5f5', border: '1px solid #ddd', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  qtyInput: { width: '60px', padding: '5px' },
  removeBtn: { background: '#f44336', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#999', padding: '20px' },
  totals: { background: '#f5f8fb', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
  grandTotal: { fontSize: '20px', fontWeight: 'bold', color: '#1E3A5F', marginTop: '10px' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', minHeight: '60px' },
  actions: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  cancelBtn: { background: '#ddd', color: '#333', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer' },
  submitBtn: { background: '#1E3A5F', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer' }
};

export default NewInvoice;