import React, { createContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={styles.container}>
        {toasts.map(toast => (
          <div key={toast.id} style={{ ...styles.toast, ...styles[toast.type] }}>
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
            <span style={styles.message}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={styles.closeBtn}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const styles = {
  container: { position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' },
  toast: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: '300px', maxWidth: '400px', animation: 'slideIn 0.3s ease' },
  success: { background: '#10b981', color: '#fff' },
  error: { background: '#ef4444', color: '#fff' },
  info: { background: '#3b82f6', color: '#fff' },
  message: { flex: 1, fontSize: '14px', fontWeight: '500' },
  closeBtn: { background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: '4px', display: 'flex' }
};

export const useToast = () => React.useContext(ToastContext);