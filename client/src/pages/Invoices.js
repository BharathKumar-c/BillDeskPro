import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Search, Eye, Trash2, FileText, Filter } from 'lucide-react';

const Invoices = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchInvoices(); }, [page, search, status]);

  const fetchInvoices = async () => {
    try {
      const res = await api.get(`/invoices?page=${page}&limit=10&search=${search}&status=${status}`);
      setInvoices(res.data.invoices);
      setTotal(res.data.total);
    } catch (err) { addToast('Failed to load invoices', 'error'); }
  };

  const handleVoid = (id) => { setDeleteId(id); };
  const confirmVoid = async () => {
    try {
      await api.patch(`/invoices/${deleteId}/void`);
      addToast('Invoice voided successfully', 'success');
      fetchInvoices();
    } catch (err) { addToast('Error voiding invoice', 'error'); }
    setDeleteId(null);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'paid': return { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', label: 'Paid' };
      case 'partial': return { bg: '#fffbeb', color: '#d97706', border: '#fde68a', label: 'Partial' };
      default: return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'Unpaid' };
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Invoices</h1>
          <p style={styles.subtitle}>Manage and track all your invoices</p>
        </div>
        <Link to="/invoices/new" style={styles.addBtn}><Plus size={18} /> New Invoice</Link>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.filtersWrap}>
          <div style={styles.searchWrap}>
            <Search size={18} style={styles.searchIcon} />
            <input type="text" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.selectWrap}>
            <Filter size={16} style={{color:'#64748b'}}/>
            <select value={status} onChange={e => setStatus(e.target.value)} style={styles.select}>
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
            </select>
          </div>
        </div>
        <div style={styles.resultCount}>{total} invoices found</div>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Invoice</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, idx) => {
              const statusStyle = getStatusStyle(inv.payment_status);
              return (
                <tr key={inv.invoice_id} style={{ ...styles.row, background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={styles.td}>
                    <div style={styles.invoiceCell}>
                      <div style={styles.invoiceIcon}><FileText size={18} /></div>
                      <span style={styles.invoiceNum}>{inv.invoice_number}</span>
                    </div>
                  </td>
                  <td style={styles.td}><span style={styles.customerName}>{inv.customer_name || 'N/A'}</span></td>
                  <td style={styles.td}><span style={styles.dateCell}>{inv.invoice_date}</span></td>
                  <td style={styles.td}><span style={styles.amountCell}>₹{parseFloat(inv.grand_total).toFixed(2)}</span></td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, background: statusStyle.bg, color: statusStyle.color, borderColor: statusStyle.border }}>
                      {statusStyle.label}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionBtns}>
                      <Link to={`/invoices/${inv.invoice_id}`} style={styles.viewBtn} title="View"><Eye size={16} /></Link>
                      {user?.role === 'admin' && <button onClick={() => handleVoid(inv.invoice_id)} style={styles.voidBtn} title="Void"><Trash2 size={16} /></button>}
                    </div>
                  </td>
                </tr>
              );
            })}
            {invoices.length === 0 && (
              <tr>
                <td colSpan="6" style={styles.empty}>
                  <FileText size={48} style={{opacity: 0.2, marginBottom: '12px'}}/>
                  <p>No invoices found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={styles.pageBtn}>Previous</button>
        <span style={styles.pageInfo}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={invoices.length < 10} style={styles.pageBtn}>Next</button>
      </div>

      <ConfirmModal isOpen={!!deleteId} title="Void Invoice" message="Are you sure you want to void this invoice? This action cannot be undone." onConfirm={confirmVoid} onCancel={() => setDeleteId(null)} confirmText="Void Invoice" type="danger" />
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  pageTitle: { fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#64748b' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', textDecoration: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  filtersWrap: { display: 'flex', gap: '12px' },
  searchWrap: { position: 'relative', width: '280px' },
  searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
  searchInput: { width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' },
  selectWrap: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0 14px' },
  select: { padding: '12px 0', border: 'none', fontSize: '14px', outline: 'none', color: '#475569' },
  resultCount: { fontSize: '14px', color: '#64748b' },
  tableCard: { background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
  th: { padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid #334155' },
  row: { transition: 'background 0.15s ease' },
  td: { padding: '16px 20px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
  invoiceCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  invoiceIcon: { width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' },
  invoiceNum: { fontWeight: '600', color: '#1e293b', fontSize: '14px' },
  customerName: { color: '#475569', fontWeight: '500', fontSize: '14px' },
  dateCell: { color: '#64748b', fontSize: '13px' },
  amountCell: { fontWeight: '700', color: '#0f172a', fontSize: '15px', fontFamily: 'ui-monospace, monospace' },
  statusBadge: { display: 'inline-flex', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', border: '1px solid' },
  actionBtns: { display: 'flex', gap: '8px' },
  viewBtn: { background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', color: '#475569', display: 'flex', textDecoration: 'none', transition: 'all 0.15s ease' },
  voidBtn: { background: '#fef2f2', border: '1px solid #fecaca', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#dc2626', display: 'flex', transition: 'all 0.15s ease' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '48px', fontSize: '14px' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' },
  pageBtn: { padding: '10px 20px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: '#475569' },
  pageInfo: { fontSize: '14px', color: '#64748b', fontWeight: '500' }
};

export default Invoices;