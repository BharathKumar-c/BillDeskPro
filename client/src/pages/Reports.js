import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Download, TrendingUp, DollarSign, FileText, Package, Users, Calendar, ArrowRight, Trophy, Award, Medal } from 'lucide-react';

const Reports = () => {
  const { addToast } = useToast();
  const [summary, setSummary] = useState({ total_invoices: 0, total_revenue: 0, paid_amount: 0, unpaid_amount: 0 });
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => { fetchReports(); }, [startDate, endDate]);

  const fetchReports = async () => {
    const params = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
    try {
      const [sumRes, trendRes, prodRes, custRes] = await Promise.all([
        api.get(`/reports/summary${params}`),
        api.get(`/reports/sales-trend${params}`),
        api.get(`/reports/top-products${params}`),
        api.get(`/reports/top-customers${params}`)
      ]);
      setSummary(sumRes.data);
      setSalesTrend(trendRes.data);
      setTopProducts(prodRes.data);
      setTopCustomers(custRes.data);
    } catch (err) { addToast('Failed to load reports', 'error'); }
  };

  const handleExport = async () => {
    const params = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}&type=sales` : '?type=sales';
    try {
      const response = await api.get(`/reports/export${params}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales_report.csv');
      document.body.appendChild(link);
      link.click();
      addToast('Report exported successfully', 'success');
    } catch (err) { addToast('Failed to export report', 'error'); }
  };

  const getRankIcon = (rank) => {
    if (rank === 0) return { icon: Trophy, color: '#f59e0b', bg: '#fef3c7', label: 'gold' };
    if (rank === 1) return { icon: Medal, color: '#6b7280', bg: '#f3f4f6', label: 'silver' };
    if (rank === 2) return { icon: Award, color: '#b45309', bg: '#fed7aa', label: 'bronze' };
    return { icon: null, color: '#94a3b8', bg: '#f1f5f9', label: '' };
  };

  const maxRevenue = topProducts.length > 0 ? Math.max(...topProducts.map(p => parseFloat(p.total_revenue))) : 1;

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Reports & Analytics</h1>
          <p style={styles.subtitle}>Track your business performance</p>
        </div>
        <button onClick={handleExport} style={styles.exportBtn}><Download size={18} /> Export CSV</button>
      </div>

      <div style={styles.filters}>
        <div style={styles.dateWrap}>
          <Calendar size={16} style={{color:'#64748b'}}/>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={styles.dateInput} />
          <span style={styles.dateSeparator}>to</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={styles.dateInput} />
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}><DollarSign size={24} /></div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Total Revenue</p>
            <p style={styles.statValue}>₹{parseFloat(summary.total_revenue || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background:'#e0f2fe'}}><FileText size={24} color="#0369a1" /></div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Total Invoices</p>
            <p style={styles.statValue}>{summary.total_invoices || 0}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background:'#dcfce7'}}><TrendingUp size={24} color="#16a34a" /></div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Paid Amount</p>
            <p style={styles.statValue}>₹{parseFloat(summary.paid_amount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background:'#fef3c7'}}><DollarSign size={24} color="#d97706" /></div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Unpaid Amount</p>
            <p style={styles.statValue}>₹{parseFloat(summary.unpaid_amount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
          </div>
        </div>
      </div>

      <div style={styles.chartSection}>
        <h2 style={styles.sectionTitle}>Sales Trend</h2>
        <div style={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.tablesGrid}>
        <div style={styles.tableCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleWrap}>
              <div style={styles.cardIcon}><Package size={20} /></div>
              <div>
                <h3 style={styles.cardTitle}>Top Products</h3>
                <p style={styles.cardSubtitle}>By revenue</p>
              </div>
            </div>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={{...styles.th, textAlign: 'left'}}>Rank</th>
                  <th style={{...styles.th, textAlign: 'left'}}>Product</th>
                  <th style={{...styles.th, textAlign: 'center'}}>Qty</th>
                  <th style={{...styles.th, textAlign: 'right'}}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => {
                  const rank = getRankIcon(i);
                  const RankIcon = rank.icon;
                  const revenuePercent = (parseFloat(p.total_revenue) / maxRevenue) * 100;
                  return (
                    <tr key={i} style={styles.row}>
                      <td style={{...styles.td, width: '60px'}}>
                        {RankIcon ? <RankIcon size={18} color={rank.color} /> : <span style={styles.rankNum}>{i + 1}</span>}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.productCell}>
                          <span style={styles.productName}>{p.product_name}</span>
                          <div style={styles.progressBar}><div style={{...styles.progressFill, width: `${revenuePercent}%`}}></div></div>
                        </div>
                      </td>
                      <td style={{...styles.td, textAlign: 'center'}}><span style={styles.qtyCell}>{Math.round(p.total_quantity)}</span></td>
                      <td style={{...styles.td, textAlign: 'right'}}><span style={styles.revenueCell}>₹{parseFloat(p.total_revenue).toLocaleString('en-IN', {minimumFractionDigits: 0})}</span></td>
                    </tr>
                  );
                })}
                {topProducts.length === 0 && (
                  <tr><td colSpan="4" style={styles.empty}><Package size={32} style={{opacity: 0.2}}/><p>No product data available</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={styles.cardFooter}>
            <span style={styles.footerLink}>View all products <ArrowRight size={14} /></span>
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleWrap}>
              <div style={{...styles.cardIcon, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}><Users size={20} /></div>
              <div>
                <h3 style={styles.cardTitle}>Top Customers</h3>
                <p style={styles.cardSubtitle}>By total spend</p>
              </div>
            </div>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={{...styles.th, textAlign: 'left'}}>Rank</th>
                  <th style={{...styles.th, textAlign: 'left'}}>Customer</th>
                  <th style={{...styles.th, textAlign: 'center'}}>Invoices</th>
                  <th style={{...styles.th, textAlign: 'right'}}>Total Spend</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => {
                  const rank = getRankIcon(i);
                  const RankIcon = rank.icon;
                  return (
                    <tr key={i} style={styles.row}>
                      <td style={{...styles.td, width: '60px'}}>
                        {RankIcon ? <RankIcon size={18} color={rank.color} /> : <span style={styles.rankNum}>{i + 1}</span>}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.customerCell}>
                          <div style={styles.customerAvatar}>{c.full_name.charAt(0)}</div>
                          <span style={styles.customerName}>{c.full_name}</span>
                        </div>
                      </td>
                      <td style={{...styles.td, textAlign: 'center'}}><span style={styles.qtyCell}>{c.total_invoices}</span></td>
                      <td style={{...styles.td, textAlign: 'right'}}><span style={styles.revenueCell}>₹{parseFloat(c.total_spend).toLocaleString('en-IN', {minimumFractionDigits: 0})}</span></td>
                    </tr>
                  );
                })}
                {topCustomers.length === 0 && (
                  <tr><td colSpan="4" style={styles.empty}><Users size={32} style={{opacity: 0.2}}/><p>No customer data available</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={styles.cardFooter}>
            <span style={styles.footerLink}>View all customers <ArrowRight size={14} /></span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  pageTitle: { fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#64748b' },
  exportBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' },
  filters: { marginBottom: '24px' },
  dateWrap: { display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', width: 'fit-content' },
  dateInput: { border: 'none', fontSize: '14px', outline: 'none', color: '#475569' },
  dateSeparator: { color: '#94a3b8', fontSize: '14px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' },
  statCard: { background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' },
  statIcon: { width: '56px', height: '56px', borderRadius: '14px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' },
  statContent: { flex: 1 },
  statLabel: { fontSize: '13px', color: '#64748b', marginBottom: '4px', fontWeight: '500' },
  statValue: { fontSize: '24px', fontWeight: '700', color: '#0f172a' },
  chartSection: { background: '#fff', padding: '28px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', marginBottom: '28px' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' },
  chartWrap: { marginTop: '10px' },
  tablesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  tableCard: { background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' },
  cardHeader: { padding: '20px 24px', borderBottom: '1px solid #f1f5f9' },
  cardTitleWrap: { display: 'flex', alignItems: 'center', gap: '14px' },
  cardIcon: { width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
  cardTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' },
  cardSubtitle: { fontSize: '12px', color: '#94a3b8' },
  tableWrapper: { padding: '0 8px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { borderBottom: '1px solid #e2e8f0' },
  th: { padding: '12px 16px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#94a3b8' },
  row: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '14px 16px', verticalAlign: 'middle' },
  rankNum: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '6px', background: '#f1f5f9', color: '#64748b', fontSize: '12px', fontWeight: '600' },
  productCell: { display: 'flex', flexDirection: 'column', gap: '6px' },
  productName: { fontWeight: '600', color: '#1e293b', fontSize: '14px' },
  progressBar: { height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '2px', transition: 'width 0.3s ease' },
  qtyCell: { display: 'inline-block', padding: '4px 10px', background: '#f8fafc', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' },
  revenueCell: { fontWeight: '700', color: '#0f172a', fontSize: '14px', fontFamily: 'ui-monospace, monospace' },
  customerCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  customerAvatar: { width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' },
  customerName: { fontWeight: '600', color: '#1e293b', fontSize: '14px' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '32px', fontSize: '13px' },
  cardFooter: { padding: '14px 24px', borderTop: '1px solid #f1f5f9', background: '#fafbfc' },
  footerLink: { display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }
};

export default Reports;