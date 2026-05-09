import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Search, Pencil, Trash2, Package, X, AlertCircle, CheckCircle, MinusCircle } from 'lucide-react';

const Products = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ product_name: '', sku: '', category: '', unit_price: '', stock_quantity: '', unit_of_measure: 'piece', description: '' });

  useEffect(() => { fetchProducts(); }, [page, search]);

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products?page=${page}&limit=10&search=${search}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) { addToast('Failed to load products', 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct.product_id}`, form);
        addToast('Product updated successfully', 'success');
      } else {
        await api.post('/products', form);
        addToast('Product created successfully', 'success');
      }
      setShowModal(false);
      setEditProduct(null);
      setForm({ product_name: '', sku: '', category: '', unit_price: '', stock_quantity: '', unit_of_measure: 'piece', description: '' });
      fetchProducts();
    } catch (err) { addToast(err.response?.data?.message || 'Error saving product', 'error'); }
  };

  const handleEdit = (p) => { setEditProduct(p); setForm(p); setShowModal(true); };
  const handleDelete = (id) => { setDeleteId(id); };
  const confirmDelete = async () => {
    try {
      await api.delete(`/products/${deleteId}`);
      addToast('Product deleted successfully', 'success');
      fetchProducts();
    } catch (err) { addToast('Error deleting product', 'error'); }
    setDeleteId(null);
  };

  const getStockStatus = (qty) => {
    if (qty === 0) return { icon: MinusCircle, color: '#dc2626', bg: '#fef2f2', text: '#dc2626', label: 'Out of Stock' };
    if (qty < 10) return { icon: AlertCircle, color: '#f59e0b', bg: '#fffbeb', text: '#d97706', label: 'Low Stock' };
    return { icon: CheckCircle, color: '#10b981', bg: '#ecfdf5', text: '#059669', label: 'In Stock' };
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Products</h1>
          <p style={styles.subtitle}>Manage your product inventory</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => { setEditProduct(null); setForm({ product_name: '', sku: '', category: '', unit_price: '', stock_quantity: '', unit_of_measure: 'piece', description: '' }); setShowModal(true); }} style={styles.addBtn}>
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      <div style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <Search size={18} style={styles.searchIcon} />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={styles.searchInput} />
        </div>
        <div style={styles.resultCount}>{total} products found</div>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Unit</th>
              {user?.role === 'admin' && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => {
              const stockStatus = getStockStatus(p.stock_quantity);
              const StockIcon = stockStatus.icon;
              return (
                <tr key={p.product_id} style={{ ...styles.row, background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={styles.td}>
                    <div style={styles.productCell}>
                      <div style={styles.productIcon}><Package size={18} /></div>
                      <span style={styles.productName}>{p.product_name}</span>
                    </div>
                  </td>
                  <td style={styles.td}><span style={styles.skuBadge}>{p.sku}</span></td>
                  <td style={styles.td}><span style={styles.categoryBadge}>{p.category}</span></td>
                  <td style={styles.td}><span style={styles.priceCell}>₹{parseFloat(p.unit_price).toFixed(2)}</span></td>
                  <td style={styles.td}>
                    <div style={styles.stockCell}>
                      <div style={{ ...styles.stockIndicator, background: stockStatus.color }}></div>
                      <span style={styles.stockNumber}>{p.stock_quantity}</span>
                      <span style={{ ...styles.stockLabel, color: stockStatus.text, background: stockStatus.bg }}><StockIcon size={12} /> {stockStatus.label}</span>
                    </div>
                  </td>
                  <td style={styles.td}><span style={styles.unitCell}>{p.unit_of_measure}</span></td>
                  {user?.role === 'admin' && (
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
                        <button onClick={() => handleEdit(p)} style={styles.editBtn} title="Edit"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(p.product_id)} style={styles.deleteBtn} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" style={styles.empty}>
                  <Package size={48} style={{opacity: 0.2, marginBottom: '12px'}}/>
                  <p>No products found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={styles.pageBtn}>Previous</button>
        <span style={styles.pageInfo}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={products.length < 10} style={styles.pageBtn}>Next</button>
      </div>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={styles.modalClose}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <input type="text" placeholder="Product Name" value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} style={styles.input} required />
                <input type="text" placeholder="SKU" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} style={styles.input} required />
                <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={styles.input} required />
                <input type="number" placeholder="Unit Price" value={form.unit_price} onChange={e => setForm({...form, unit_price: e.target.value})} style={styles.input} required />
                <input type="number" placeholder="Stock Quantity" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} style={styles.input} required />
                <input type="text" placeholder="Unit of Measure" value={form.unit_of_measure} onChange={e => setForm({...form, unit_of_measure: e.target.value})} style={styles.input} />
              </div>
              <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={styles.textarea} />
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.submitBtn}>{editProduct ? 'Update Product' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Delete Product" message="Are you sure you want to delete this product? This action cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} confirmText="Delete" type="danger" />
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
  productCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  productIcon: { width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' },
  productName: { fontWeight: '600', color: '#1e293b', fontSize: '14px' },
  skuBadge: { display: 'inline-block', background: '#f8fafc', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', color: '#64748b', fontFamily: 'monospace', border: '1px solid #e2e8f0' },
  categoryBadge: { display: 'inline-block', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', border: '1px solid #bfdbfe', color: '#2563eb', background: '#eff6ff' },
  priceCell: { fontWeight: '700', color: '#0f172a', fontSize: '15px', fontFamily: 'ui-monospace, monospace' },
  stockCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  stockIndicator: { width: '8px', height: '8px', borderRadius: '50%' },
  stockNumber: { fontWeight: '600', color: '#1e293b', fontSize: '14px', marginRight: '4px' },
  stockLabel: { display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' },
  unitCell: { color: '#64748b', fontSize: '13px' },
  actionBtns: { display: 'flex', gap: '8px' },
  editBtn: { background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#475569', display: 'flex', transition: 'all 0.15s ease' },
  deleteBtn: { background: '#fef2f2', border: '1px solid #fecaca', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#dc2626', display: 'flex', transition: 'all 0.15s ease' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '48px', fontSize: '14px' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' },
  pageBtn: { padding: '10px 20px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: '#475569' },
  pageInfo: { fontSize: '14px', color: '#64748b', fontWeight: '500' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' },
  modalContent: { background: '#fff', borderRadius: '16px', padding: '28px', width: '520px', maxWidth: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  modalClose: { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  input: { width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' },
  textarea: { width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', minHeight: '80px', marginBottom: '20px', outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px' },
  cancelBtn: { background: '#f1f5f9', color: '#475569', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
  submitBtn: { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }
};

export default Products;