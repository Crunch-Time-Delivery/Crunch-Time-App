import React from 'react';

export function AddButton() {
  return (
    <button
      id="add-restaurant"
      style={{ margin: '20px', padding: '12px 20px', background: 'red', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1em', cursor: 'pointer' }}
    >
      Add Restaurant Menu
    </button>
  );
}