import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { DollarSign, FileText, Users, Package, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total_invoices: 0, total_revenue: 0, total_customers: 0, total_products: 0 });
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [productsRes, customersRes, invoicesRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/customers?limit=100'),
        api.get('/invoices?limit=5')
      ]);
      setStats({
        total_products: productsRes.data.total || 0,
        total_customers: customersRes.data.total || 0,
        total_invoices: invoicesRes.data.total || 0,
        total_revenue: invoicesRes.data.invoices?.reduce((sum, inv) => sum + (inv.grand_total || 0), 0) || 0
      });
      setRecentInvoices(invoicesRes.data.invoices || []);
    } catch (err) { console.error(err); }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'paid': return { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', label: 'Paid' };
      case 'partial': return { bg: '#fffbeb', color: '#d97706', border: '#fde68a', label: 'Partial' };
      default: return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'Unpaid' };
    }
  };

  const statCards = [
    { title: 'Total Revenue', value: `₹${(stats.total_revenue || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}`, icon: DollarSign, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    { title: 'Total Invoices', value: stats.total_invoices, icon: FileText, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
    { title: 'Total Customers', value: stats.total_customers, icon: Users, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
    { title: 'Total Products', value: stats.total_products, icon: Package, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }
  ];

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.subtitle}>Welcome back! Here's your business overview.</p>
        </div>
        <div style={styles.dateBadge}><TrendingUp size={16} /> Live Data</div>
      </div>

      <div style={styles.statsGrid}>
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} style={styles.statCard}>
              <div style={styles.statIconWrap}>
                <div style={{...styles.statIcon, background: stat.gradient}}><Icon size={24} /></div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>{stat.title}</p>
                <p style={styles.statValue}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Recent Invoices</h2>
            <p style={styles.sectionSubtitle}>Latest transactions</p>
          </div>
          <Link to="/invoices" style={styles.viewAllLink}>View All <ArrowRight size={16} /></Link>
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
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv, idx) => {
                const statusStyle = getStatusStyle(inv.payment_status);
                return (
                  <tr key={inv.invoice_id} style={{ ...styles.row, background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={styles.td}>
                      <div style={styles.invoiceCell}>
                        <div style={styles.invoiceIcon}><FileText size={16} /></div>
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
                  </tr>
                );
              })}
              {recentInvoices.length === 0 && (
                <tr>
                  <td colSpan="5" style={styles.empty}>
                    <FileText size={40} style={{opacity: 0.2, marginBottom: '8px'}}/>
                    <p>No recent invoices</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
  pageTitle: { fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#64748b' },
  dateBadge: { display: 'flex', alignItems: 'center', gap: '8px', background: '#dcfce7', color: '#16a34a', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' },
  statCard: { background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '18px' },
  statIconWrap: { flexShrink: 0 },
  statIcon: { width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
  statContent: { flex: 1 },
  statLabel: { fontSize: '13px', color: '#64748b', marginBottom: '4px', fontWeight: '500' },
  statValue: { fontSize: '26px', fontWeight: '700', color: '#0f172a' },
  section: { background: '#fff', padding: '28px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' },
  sectionSubtitle: { fontSize: '13px', color: '#94a3b8' },
  viewAllLink: { display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '600' },
  tableCard: { borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
  th: { padding: '14px 18px', textAlign: 'left', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid #334155' },
  row: { transition: 'background 0.15s ease' },
  td: { padding: '14px 18px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
  invoiceCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  invoiceIcon: { width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' },
  invoiceNum: { fontWeight: '600', color: '#1e293b', fontSize: '13px' },
  customerName: { color: '#475569', fontWeight: '500', fontSize: '13px' },
  dateCell: { color: '#64748b', fontSize: '12px' },
  amountCell: { fontWeight: '700', color: '#0f172a', fontSize: '14px', fontFamily: 'ui-monospace, monospace' },
  statusBadge: { display: 'inline-flex', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', border: '1px solid' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '32px', fontSize: '14px' }
};

export default Dashboard;