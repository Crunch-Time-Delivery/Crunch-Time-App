import React from 'react';

export function Header({ toggleMenu }) {
  return (
    <div className="header">
      <div className="menu-container">
        <div
          className="menu-icon"
          title="Menu"
          style={{ cursor: 'pointer', fontSize: 24 }}
          onClick={toggleMenu}
        >
          ☰
        </div>
        <div id="menuDropdown" style={{ display: 'none', position: 'absolute', top: '40px', left: 0, backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', padding: '10px', flexDirection: 'column', gap: '10px', zIndex: 1000 }}>
          <button onClick={() => window.showSection('dashboard')}>Dashboard</button>
          <button onClick={() => window.location.href='http://127.0.0.1:5500/driver-app/admin/estabilshment.html'}>Establishment</button>
          <button onClick={() => window.location.href='http://127.0.0.1:5500/driver-app/admin/restaurant_menu.html'}>Restaurant Menu</button>
          <button onClick={() => window.showSection('Driver')}>Driver</button>
          <button onClick={() => window.showSection('Vendor')}>Vendor</button>
        </div>
      </div>
    </div>
  );
}