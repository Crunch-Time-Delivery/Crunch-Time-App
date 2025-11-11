import React, { useState } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const openAddModal = () => {
    setEditIndex(-1);
    setEmail('');
    setName('');
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    const u = users[index];
    setEditIndex(index);
    setEmail(u.email);
    setName(u.name);
    setIsModalOpen(true);
  };

  const saveUser = () => {
    if (!email || !name) {
      alert('Fill all fields');
      return;
    }
    const newUser = { email, name };
    if (editIndex >= 0) {
      const updatedUsers = [...users];
      updatedUsers[editIndex] = newUser;
      setUsers(updatedUsers);
    } else {
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const deleteUser = (index) => {
    const newUsers = [...users];
    newUsers.splice(index, 1);
    setUsers(newUsers);
  };

  return (
    <div>
      <h3>Users</h3>
      <button onClick={openAddModal}>Add User</button>
      {users.length === 0 ? (
        <p>No users</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.email}</td>
                <td>{u.name}</td>
                <td>
                  <button onClick={() => openEditModal(i)}>Edit</button>
                  <button style={{ backgroundColor: '#f44336' }} onClick={() => deleteUser(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-box">
            <h4>{editIndex >= 0 ? 'Edit User' : 'Add User'}</h4>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={saveUser}>Save</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;