// ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // <-- Replace with your key
const supabase = createClient(supabaseUrl, supabaseKey);

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.from('Users').select('*');
    if (error) {
      setError(error.message);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete user ID ${id}?`)) {
      const { error } = await supabase.from('Users').delete().eq('id', id);
      if (error) {
        alert('Error deleting user: ' + error.message);
      } else {
        alert('User deleted');
        fetchUsers();
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ margin: '30px auto', maxWidth: '1200px', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Manage Users</h1>
      
      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
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

      {/* User Table */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f1f1' }}>
            <tr>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>ID</th>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>Role</th>
              <th style={{ padding: '12px', border: '1px solid #ccc' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{user.id}</td>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{user.name}</td>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{user.email}</td>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{user.role}</td>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>
                  <button className="btn edit" onClick={() => alert(`Edit user ${user.id}`)} style={{ backgroundColor: '#d85d5d', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 12px', marginRight: '8px' }}>Edit</button>
                  <button className="btn delete" onClick={() => handleDelete(user.id)} style={{ backgroundColor: '#db8989', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 12px' }}>Delete</button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'center' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;