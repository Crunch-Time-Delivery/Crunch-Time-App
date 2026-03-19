import React from 'react';

export function FilterSearch() {
  return (
    <div
      className="filter-search-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#fff',
        gap: 10,
      }}
    >
      <select
        id="establishment-filter"
        className="filter-dropdown"
        style={{
          padding: '8px 12px',
          borderRadius: 4,
          border: '1px solid #ccc',
          fontSize: '1em',
        }}
      >
        <option value="">Select Establishment</option>
        <option value="Restaurant">Restaurant</option>
        <option value="Cafe">Cafe</option>
        <option value="Bar">Bar</option>
        <option value="Diner">Diner</option>
      </select>
      <input
        type="text"
        id="search-input"
        placeholder="Search..."
        style={{
          padding: '8px 12px',
          borderRadius: 4,
          border: '1px solid #ccc',
          fontSize: '1em',
          flex: 1,
        }}
      />
    </div>
  );
}