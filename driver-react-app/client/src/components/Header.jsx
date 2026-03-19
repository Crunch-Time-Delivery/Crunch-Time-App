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
        {/* Dropdown menu handled via toggle */}
      </div>
    </div>
  );
}