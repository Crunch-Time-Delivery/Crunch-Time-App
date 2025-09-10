import { useState } from 'react'
import './supabaseClient.js';
import '.src/main.jsx';
import '.src/app.jsx';
import '.index.html';

// src/UserManagement.jsx

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')  // your users table
      .select('*');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user?')) return;
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    if (error) {
      console.error('Error deleting user:', error);
    } else {
      alert('User deleted');
      fetchUsers();
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <button onClick={fetchUsers}>Refresh</button>
      <table border="1" style={{ width: '100%', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Email</th><th>Name</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>
                {/* You can implement editing here */}
                <button onClick={() => alert('Edit user?')}>Edit</button>
                <button onClick={() => deleteUser(user.id)} style={{ backgroundColor: 'red', color: '#fff' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;