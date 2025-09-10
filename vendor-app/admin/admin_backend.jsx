import { useState } from 'react'
import './supabaseClient.js';
import '.src/main.jsx';
import '.src/app.jsx';
import '.index.html';

// src/VendorManagement.jsx

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function VendorManagement() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from('vendors') // your vendors table
      .select('*');
    if (error) {
      console.error('Error fetching vendors:', error);
    } else {
      setVendors(data);
    }
  };

  const deleteVendor = async (vendorId) => {
    if (!confirm('Delete this vendor?')) return;
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', vendorId);
    if (error) {
      console.error('Error deleting vendor:', error);
    } else {
      alert('Vendor deleted');
      fetchVendors();
    }
  };

  return (
    <div>
      <h2>Vendor Management</h2>
      <button onClick={fetchVendors}>Refresh</button>
      <table border="1" style={{ width: '100%', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Email</th><th>Name</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(vendor => (
            <tr key={vendor.id}>
              <td>{vendor.email}</td>
              <td>{vendor.name}</td>
              <td>
                <button onClick={() => alert('View vendor?')}>View</button>
                <button onClick={() => deleteVendor(vendor.id)} style={{ backgroundColor: 'red', color: '#fff' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VendorManagement;