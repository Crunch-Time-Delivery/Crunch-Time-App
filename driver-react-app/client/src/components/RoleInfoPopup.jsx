import React from 'react';

export function RoleInfoPopup({ role, onClose }) {
  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-box" style={{ width: '90%', maxHeight: '90%', overflowY: 'auto' }}>
        <h3>Role Information</h3>
        <div>
          <h4>{role.roleType} Role Details</h4>
          <p>Email: {role.email}</p>
          <p>Role: {role.roleType}</p>
          <p>Status: Active</p>
        </div>
        <button style={{ marginTop: 10, background: 'red', color: '#fff', width: '100%', padding: 10 }} onClick={() => alert('Send notification')}>Send Email/Notification</button>
        <button style={{ marginTop: 10, background: 'red', color: '#fff', width: '100%', padding: 10 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}