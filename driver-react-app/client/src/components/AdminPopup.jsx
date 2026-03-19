import React from 'react';

export function AdminPopup({ onClose, onSave }) {
  const handleSave = () => {
    const newU = document.getElementById('newUsername').value.trim();
    const newP = document.getElementById('newPassword').value.trim();
    if (newU && newP) {
      onSave({ username: newU, password: newP });
    } else {
      alert('Please fill in both fields.');
    }
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-box" style={{ width: 400, overflowY: 'auto' }}>
        <h3>Admin Update</h3>
        <div>
          <label>Change Username:</label>
          <input id="newUsername" />
        </div>
        <div>
          <label>Change Password:</label>
          <input id="newPassword" type="password" />
        </div>
        <button onClick={handleSave}>Save Credentials</button>
        <button onClick={onClose} style={{ marginTop: 10, background: 'red', color: '#fff', width: '100%' }}>Close</button>
      </div>
    </div>
  );
}