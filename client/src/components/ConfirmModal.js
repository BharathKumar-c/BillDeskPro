import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={{ ...styles.iconContainer, background: type === 'danger' ? '#fef2f2' : '#eff6ff' }}>
            <AlertTriangle size={24} color={type === 'danger' ? '#dc2626' : '#2563eb'} />
          </div>
          <button onClick={onCancel} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button onClick={onCancel} style={styles.cancelBtn}>{cancelText}</button>
          <button onClick={onConfirm} style={{ ...styles.confirmBtn, background: type === 'danger' ? '#dc2626' : '#2563eb' }}>{confirmText}</button>
        </div>
      </div>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' },
  modal: { background: '#fff', borderRadius: '16px', padding: '28px', width: '400px', maxWidth: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  iconContainer: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  closeBtn: { background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '4px' },
  title: { fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' },
  message: { fontSize: '14px', color: '#6b7280', lineHeight: '1.6', marginBottom: '24px' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: '500', cursor: 'pointer', fontSize: '14px' },
  confirmBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', color: '#fff', fontWeight: '500', cursor: 'pointer', fontSize: '14px' }
};

export default ConfirmModal;