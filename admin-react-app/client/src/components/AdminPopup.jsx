import React, { useRef } from 'react';

export function AdminPopup({ onClose, onSave }) {
  const newUsernameRef = useRef();
  const newPasswordRef = useRef();
  const newAdminEmailRef = useRef();
  const newAdminUsernameRef = useRef();
  const newAdminPasswordRef = useRef();

  const handleSave = () => {
    onSave &&
      onSave({
        username: newUsernameRef.current.value,
        password: newPasswordRef.current.value,
        email: newAdminEmailRef.current.value,
        adminUsername: newAdminUsernameRef.current.value,
        adminPassword: newAdminPasswordRef.current.value,
      });
  };

  return (
    <div className="modal">
      <div className="modal-box" style={{ width: 400, overflowY: 'auto' }}>
        {/* Your popup UI */}
        <h3>Admin Update</h3>
        {/* Change credentials */}
        <input ref={newUsernameRef} placeholder="New Username" />
        <input ref={newPasswordRef} type="password" placeholder="New Password" />
        <button onClick={handleSave}>Save Credentials</button>
        {/* Add new admin */}
        <h4>Add New Admin</h4>
        <input ref={newAdminEmailRef} placeholder="Email" />
        <input ref={newAdminUsernameRef} placeholder="Username" />
        <input ref={newAdminPasswordRef} type="password" placeholder="Password" />
        <button onClick={() => {
          if (onClose) onClose();
        }}>Add Admin</button>
        <button onClick={onClose} style={{ marginTop: 10, background: 'red', color: '#fff', width: '100%' }}>Close</button>
      </div>
    </div>
  );
}