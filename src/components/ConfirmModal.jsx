import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, showPassword, pwd, setPwd }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <p style={{ color: '#ccc' }}>{message}</p>
        
        {showPassword && (
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            style={inputStyle}
          />
        )}

        <div style={btnGroup}>
          <button onClick={onCancel} style={cancelBtn}>Cancel</button>
          <button onClick={onConfirm} style={confirmBtn}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalStyle = {
  backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px',
  border: '1px solid #333', width: '350px', textAlign: 'center', color: 'white'
};

const inputStyle = {
  width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '6px',
  border: '1px solid #444', backgroundColor: '#000', color: 'white', boxSizing: 'border-box'
};

const btnGroup = { display: 'flex', gap: '10px', justifyContent: 'center' };
const cancelBtn = { padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const confirmBtn = { padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default ConfirmModal;