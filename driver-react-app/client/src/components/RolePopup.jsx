import React from 'react';

export function RolePopup({ onClose }) {
  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-box" style={{ width: '90%', maxHeight: '90%', overflowY: 'auto' }}>
        <h3>Role Management</h3>
        {/* Add role management UI here */}
        {/* ... */}
        <button style={{ marginTop: 15, background: 'red', color: '#fff', width: '100%', padding: 10 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}