import React from 'react';

export function TopBar() {
  return (
    <div className="top-bar">
      <div className="profile-section" style={{ display: 'flex', alignItems: 'center' }}>
        <div
          className="profile-picture"
          style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#fff', marginRight: 10 }}
        />
        <div className="admin-name" style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2em' }}>
          Restaurant Menu
        </div>
      </div>
    </div>
  );
}