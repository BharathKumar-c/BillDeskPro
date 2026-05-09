import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ payment_status: 'paid', amount_paid: 0 });

  useEffect(() => { fetchInvoice(); }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await api.get(`/invoices/${id}`);
      setInvoice(res.data);
      setPaymentForm({ payment_status: res.data.payment_status, amount_paid: res.data.amount_paid });
    } catch (err) { console.error(err); }
  };

  const handlePaymentUpdate = async (e) => {
    e.preventDefault();
    await api.patch(`/invoices/${id}/payment`, paymentForm);
    setShowPaymentModal(false);
    fetchInvoice();
  };

  const handlePrint = () => window.print();

  if (!invoice) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.header}>
        <button onClick={() => navigate('/invoices')} style={styles.backBtn}>← Back</button>
        <div style={styles.actions}>
          <button onClick={() => setShowPaymentModal(true)} style={styles.paymentBtn}>Update Payment</button>
          <button onClick={handlePrint} style={styles.printBtn}>Print</button>
        </div>
      </div>

      <div style={styles.invoice}>
        <div style={styles.invoiceHeader}>
          <h1 style={styles.logo}>BillDeskPro</h1>
          <div style={styles.invoiceInfo}>
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> {invoice.invoice_number}</p>
            <p><strong>Date:</strong> {invoice.invoice_date}</p>
          </div>
        </div>

        <div style={styles.customerInfo}>
          <h3>Bill To:</h3>
          <p><strong>{invoice.customer_name}</strong></p>
          <p>{invoice.customer_phone}</p>
          <p>{invoice.customer_address}</p>
          {invoice.customer_gstin && <p>GSTIN: {invoice.customer_gstin}</p>}
        </div>

        <table style={styles.table}>
          <thead>
            <tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th></tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, idx) => (
              <tr key={idx}>
                <td>{item.product_name}</td>
                <td>₹{item.unit_price}</td>
                <td>{item.quantity}</td>
                <td>₹{item.line_total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.totals}>
          <p>Subtotal: ₹{invoice.subtotal}</p>
          <p>Tax ({invoice.tax_rate}%): ₹{invoice.tax_amount}</p>
          {invoice.discount_type !== 'none' && <p>Discount: -₹{invoice.discount_value}</p>}
          <p style={styles.grandTotal}>Grand Total: ₹{invoice.grand_total}</p>
          <p>Amount Paid: ₹{invoice.amount_paid}</p>
          <p>Status: <span style={{ ...styles.status, background: invoice.payment_status === 'paid' ? '#4caf50' : invoice.payment_status === 'partial' ? '#ff9800' : '#f44336' }}>{invoice.payment_status.toUpperCase()}</span></p>
        </div>

        {invoice.notes && <div style={styles.notes}><strong>Notes:</strong> {invoice.notes}</div>}
      </div>

      {showPaymentModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Update Payment</h2>
            <form onSubmit={handlePaymentUpdate}>
              <select value={paymentForm.payment_status} onChange={e => setPaymentForm({...paymentForm, payment_status: e.target.value})} style={styles.input}>
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
              <input type="number" placeholder="Amount Paid" value={paymentForm.amount_paid} onChange={e => setPaymentForm({...paymentForm, amount_paid: e.target.value})} style={styles.input} />
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowPaymentModal(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@media print { body { background: #fff; } .no-print { display: none; } }`}</style>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  backBtn: { background: 'none', border: 'none', color: '#2E75B6', cursor: 'pointer', fontSize: '16px' },
  actions: { display: 'flex', gap: '10px' },
  paymentBtn: { background: '#2E75B6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  printBtn: { background: '#1E3A5F', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  invoice: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  invoiceHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '2px solid #1E3A5F', paddingBottom: '20px' },
  logo: { color: '#1E3A5F', fontSize: '32px' },
  invoiceInfo: { textAlign: 'right' },
  customerInfo: { marginBottom: '30px' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '30px' },
  totals: { textAlign: 'right', fontSize: '16px' },
  grandTotal: { fontSize: '20px', fontWeight: 'bold', color: '#1E3A5F' },
  status: { padding: '4px 10px', borderRadius: '4px', color: '#fff', fontSize: '12px' },
  notes: { marginTop: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '6px' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { background: '#fff', padding: '30px', borderRadius: '12px', width: '400px' },
  input: { width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '6px' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  cancelBtn: { background: '#ddd', color: '#333', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  submitBtn: { background: '#1E3A5F', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default InvoiceDetail;