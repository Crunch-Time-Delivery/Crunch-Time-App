import React from 'react';

export function TopBar() {
  return (
    <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: 'red' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="profile-picture" style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#fff', marginRight: 10 }} />
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2em' }}>Admin Establishment</div>
      </div>
    </div>
  );
}