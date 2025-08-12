import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function ItemManagePage() {
  const [items, setItems] = useState([
    { id: 1, name: 'Burger', price: 50, description: 'Beef burger' },
    { id: 2, name: 'Pizza', price: 80, description: 'Cheese pizza' },
  ]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });
  const [editItemId, setEditItemId] = useState(null);
  const [editData, setEditData] = useState({ name: '', price: '', description: '' });

  const handleAdd = () => {
    const id = Date.now();
    setItems([...items, { id, ...newItem }]);
    setNewItem({ name: '', price: '', description: '' });
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditItemId(item.id);
    setEditData({ name: item.name, price: item.price, description: item.description });
  };

  const handleUpdate = () => {
    setItems(items.map(item => (item.id === editItemId ? { ...item, ...editData } : item)));
    setEditItemId(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Item Management</h2>
      {/* Add New Item */}
      <div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
        <input
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <button onClick={handleAdd}>Add Item</button>
      </div>
      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {editItemId === item.id ? (
                <>
                  <td>
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditItemId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.description}</td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default ItemManagePage