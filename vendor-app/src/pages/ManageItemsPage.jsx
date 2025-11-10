import React, { useState } from 'react';

const ManageItems = () => {
  const [items, setItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [vendor, setVendor] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('In Stock');

  const openAddModal = () => {
    setEditIndex(-1);
    setVendor('');
    setName('');
    setPrice('');
    setStock('In Stock');
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    const item = items[index];
    setEditIndex(index);
    setVendor(item.vendor);
    setName(item.item);
    setPrice(item.price);
    setStock(item.stock);
    setIsModalOpen(true);
  };

  const saveItem = () => {
    if (!vendor || !name || isNaN(parseFloat(price))) {
      alert('Fill all fields');
      return;
    }
    const newItem = { vendor, item: name, price: parseFloat(price), stock };
    if (editIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[editIndex] = newItem;
      setItems(updatedItems);
    } else {
      setItems([...items, newItem]);
    }
    setIsModalOpen(false);
  };

  const deleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <div>
      <h3>Items</h3>
      <button onClick={openAddModal}>Add Item</button>
      {items.length === 0 ? (
        <p>No items</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Item</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>{it.vendor}</td>
                <td>{it.item}</td>
                <td>R {it.price.toFixed(2)}</td>
                <td>{it.stock}</td>
                <td>
                  <button onClick={() => openEditModal(i)}>Edit</button>
                  <button style={{ backgroundColor: '#f44336' }} onClick={() => deleteItem(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-box">
            <h4>{editIndex >= 0 ? 'Edit Item' : 'Add Item'}</h4>
            <input
              placeholder="Vendor"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            />
            <input
              placeholder="Item"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <select value={stock} onChange={(e) => setStock(e.target.value)}>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <button onClick={saveItem}>Save</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItemsPage;