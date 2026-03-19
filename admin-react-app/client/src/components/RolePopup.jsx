import React from 'react';

export function RolePopup({ onClose }) {
  return (
    <div className="modal" style={{ display:'flex', flexDirection:'column' }}>
      <div className="modal-box" style={{ width:'90%', maxHeight:'90%', overflowY:'auto' }}>
        {/* Role management UI */}
        <h3>Role Management</h3>
        {/* User Accounts Table */}
        {/* ... your tables ... */}
        {/* Close Button */}
        <button style={{ marginTop:15, background:'red', color:'#fff', width:'100%', padding:10, border:'none', borderRadius:6 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}