import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      addToast('Welcome back! Login successful', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid credentials', 'error');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>B</div>
          <h1 style={styles.title}>BillDeskPro</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={styles.inputIcon}><User size={18} /></div>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <div style={styles.inputIcon}><Lock size={18} /></div>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} required />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing in...' : <>Sign In <LogIn size={18} /></>}
          </button>
        </form>
        <div style={styles.footer}>
          <p style={styles.hint}>Demo: admin / admin123</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', position: 'relative', overflow: 'hidden' },
  backgroundPattern: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)' },
  card: { background: '#fff', padding: '48px', borderRadius: '24px', boxShadow: '0 25px 80px rgba(0,0,0,0.3)', width: '420px', position: 'relative', zIndex: 1 },
  logoSection: { textAlign: 'center', marginBottom: '36px' },
  logo: { width: '72px', height: '72px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)' },
  title: { fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' },
  subtitle: { color: '#64748b', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 1 },
  input: { width: '100%', padding: '16px 16px 16px 48px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' },
  button: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)', transition: 'transform 0.2s' },
  footer: { textAlign: 'center', marginTop: '28px' },
  hint: { color: '#94a3b8', fontSize: '13px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }
};

export default Login;