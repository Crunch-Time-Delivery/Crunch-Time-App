// PaymentManagement.jsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // <-- Replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch payment data on mount
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.from('Payments').select('*');
    if (error) {
      setError(error.message);
    } else {
      setPayments(data);
    }
    setLoading(false);
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm(`Delete transaction ${transactionId}?`)) {
      const { error } = await supabase.from('Payments').delete().eq('transaction_id', transactionId);
      if (error) {
        alert('Error deleting: ' + error.message);
      } else {
        alert('Deleted');
        fetchPayments();
      }
    }
  };

  const filteredPayments = payments.filter(p =>
    p.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ margin: '30px auto', maxWidth: '1100px', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Payment Management</h2>

      {/* Search Box */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by order ID or amount..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', fontSize: '1em', width: '50%', maxWidth: '400px', borderRadius: '4px 0 0 4px', border: '1px solid #ccc' }}
        />
        <button
          onClick={() => {}}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}
        >
          Search
        </button>
      </div>

      {/* Payment Table */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f1f1' }}>
            <tr>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>Transaction ID</th>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>Order ID</th>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>Amount</th>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>Method</th>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>Status</th>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(p => (
              <tr key={p.transaction_id}>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{p.transaction_id}</td>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{p.order_id}</td>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>${p.amount}</td>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{p.method}</td>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{p.status}</td>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>
                  <button className="btn edit" style={{ backgroundColor: '#ffc107', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 12px', marginRight: '8px' }} onClick={() => alert(`Edit ${p.transaction_id}`)}>Edit</button>
                  <button className="btn delete" style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 12px' }} onClick={() => handleDelete(p.transaction_id)}>Delete</button>
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'center' }}>No results found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentManagement;