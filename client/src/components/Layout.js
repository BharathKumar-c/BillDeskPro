import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Users, FileText, BarChart3, LogOut, ChevronRight } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/invoices', label: 'Invoices', icon: FileText },
    ...(user?.role === 'admin' ? [{ path: '/reports', label: 'Reports', icon: BarChart3 }] : [])
  ];

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>B</div>
          <span>BillDeskPro</span>
        </div>
        <nav style={styles.nav}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) }}>
                <div style={styles.navIconWrap}>
                  <Icon size={20} />
                </div>
                <span style={styles.navLabel}>{item.label}</span>
                {isActive && <ChevronRight size={16} style={styles.navArrow} />}
              </Link>
            );
          })}
        </nav>
        <div style={styles.userSection}>
          <div style={styles.userAvatar}>
            {user?.full_name?.charAt(0) || 'A'}
          </div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{user?.full_name}</p>
            <p style={styles.userRole}>{user?.role === 'admin' ? 'Administrator' : 'Cashier'}</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#f8fafc' },
  sidebar: { width: '260px', background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', color: '#fff', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', boxShadow: '4px 0 20px rgba(0,0,0,0.1)' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' },
  logoIcon: { width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' },
  nav: { flex: 1 },
  navLink: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderRadius: '10px', marginBottom: '6px', transition: 'all 0.2s ease', fontSize: '14px', fontWeight: '500' },
  navLinkActive: { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' },
  navIconWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px' },
  navLabel: { flex: 1 },
  navArrow: { opacity: 0.6 },
  userSection: { padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' },
  userAvatar: { width: '42px', height: '42px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { fontSize: '14px', fontWeight: '600', marginBottom: '2px' },
  userRole: { fontSize: '12px', opacity: 0.6, textTransform: 'capitalize' },
  logoutBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.7)', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' },
  main: { flex: 1, marginLeft: '260px', padding: '32px', overflow: 'auto' }
};

export default Layout;