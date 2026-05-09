import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Search, Pencil, Trash2, Users, X, Phone, Mail, MapPin } from 'lucide-react';

const Customers = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', address: '', gstin: '' });

  useEffect(() => { fetchCustomers(); }, [page, search]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get(`/customers?page=${page}&limit=10&search=${search}`);
      setCustomers(res.data.customers);
      setTotal(res.data.total);
    } catch (err) { addToast('Failed to load customers', 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCustomer) {
        await api.put(`/customers/${editCustomer.customer_id}`, form);
        addToast('Customer updated successfully', 'success');
      } else {
        await api.post('/customers', form);
        addToast('Customer created successfully', 'success');
      }
      setShowModal(false);
      setEditCustomer(null);
      setForm({ full_name: '', phone: '', email: '', address: '', gstin: '' });
      fetchCustomers();
    } catch (err) { addToast(err.response?.data?.message || 'Error saving customer', 'error'); }
  };

  const handleEdit = (c) => { setEditCustomer(c); setForm(c); setShowModal(true); };
  const handleDelete = (id) => { setDeleteId(id); };
  const confirmDelete = async () => {
    try {
      await api.delete(`/customers/${deleteId}`);
      addToast('Customer deleted successfully', 'success');
      fetchCustomers();
    } catch (err) { addToast('Error deleting customer', 'error'); }
    setDeleteId(null);
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Customers</h1>
          <p style={styles.subtitle}>Manage your customer database</p>
        </div>
        <button onClick={() => { setEditCustomer(null); setForm({ full_name: '', phone: '', email: '', address: '', gstin: '' }); setShowModal(true); }} style={styles.addBtn}>
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <Search size={18} style={styles.searchIcon} />
          <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} style={styles.searchInput} />
        </div>
        <div style={styles.resultCount}>{total} customers found</div>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>GSTIN</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, idx) => (
              <tr key={c.customer_id} style={{ ...styles.row, background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={styles.td}>
                  <div style={styles.customerCell}>
                    <div style={styles.avatar}>{c.full_name.charAt(0)}</div>
                    <span style={styles.customerName}>{c.full_name}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={styles.contactCell}><Phone size={14} /> <span style={styles.contactText}>{c.phone}</span></div>
                </td>
                <td style={styles.td}>
                  {c.email ? <div style={styles.emailCell}><Mail size={14} /> <span style={styles.emailText}>{c.email}</span></div> : <span style={styles.emptyText}>-</span>}
                </td>
                <td style={styles.td}><span style={styles.addressText}>{c.address || '-'}</span></td>
                <td style={styles.td}>{c.gstin ? <span style={styles.gstinBadge}>{c.gstin}</span> : <span style={styles.emptyText}>-</span>}</td>
                <td style={styles.td}>
                  <div style={styles.actionBtns}>
                    <button onClick={() => handleEdit(c)} style={styles.editBtn} title="Edit"><Pencil size={16} /></button>
                    {user?.role === 'admin' && <button onClick={() => handleDelete(c.customer_id)} style={styles.deleteBtn} title="Delete"><Trash2 size={16} /></button>}
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="6" style={styles.empty}>
                  <Users size={48} style={{opacity: 0.2, marginBottom: '12px'}}/>
                  <p>No customers found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={styles.pageBtn}>Previous</button>
        <span style={styles.pageInfo}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={customers.length < 10} style={styles.pageBtn}>Next</button>
      </div>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>{editCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button onClick={() => setShowModal(false)} style={styles.modalClose}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <input type="text" placeholder="Full Name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={styles.input} required />
                <input type="text" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={styles.input} required />
                <input type="email" placeholder="Email (optional)" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={styles.input} />
                <input type="text" placeholder="GSTIN (optional)" value={form.gstin} onChange={e => setForm({...form, gstin: e.target.value})} style={styles.input} />
              </div>
              <textarea placeholder="Address (optional)" value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={styles.textarea} />
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>{editCustomer ? 'Update Customer' : 'Create Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Delete Customer" message="Are you sure you want to delete this customer? This action cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} confirmText="Delete" type="danger" />
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  pageTitle: { fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#64748b' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  searchWrap: { position: 'relative', width: '320px' },
  searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
  searchInput: { width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' },
  resultCount: { fontSize: '14px', color: '#64748b' },
  tableCard: { background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
  th: { padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid #334155' },
  row: { transition: 'background 0.15s ease' },
  td: { padding: '16px 20px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
  customerCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px' },
  customerName: { fontWeight: '600', color: '#1e293b', fontSize: '14px' },
  contactCell: { display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' },
  contactText: { color: '#475569' },
  emailCell: { display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' },
  emailText: { color: '#475569' },
  addressText: { color: '#64748b', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' },
  emptyText: { color: '#cbd5e1' },
  gstinBadge: { display: 'inline-block', background: '#fffbeb', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', color: '#d97706', border: '1px solid #fcd34d' },
  actionBtns: { display: 'flex', gap: '8px' },
  editBtn: { background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#475569', display: 'flex', transition: 'all 0.15s ease' },
  deleteBtn: { background: '#fef2f2', border: '1px solid #fecaca', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#dc2626', display: 'flex', transition: 'all 0.15s ease' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '48px', fontSize: '14px' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' },
  pageBtn: { padding: '10px 20px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: '#475569' },
  pageInfo: { fontSize: '14px', color: '#64748b', fontWeight: '500' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' },
  modalContent: { background: '#fff', borderRadius: '16px', padding: '28px', width: '500px', maxWidth: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  modalClose: { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  input: { width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' },
  textarea: { width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', minHeight: '80px', marginBottom: '20px', outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px' },
  cancelBtn: { background: '#f1f5f9', color: '#475569', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
  submitBtn: { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }
};

export default Customers;