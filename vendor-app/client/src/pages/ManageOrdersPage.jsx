import React, { useState } from 'react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  const promptAddOrder = () => {
    const customer = prompt('Customer name:');
    const totalStr = prompt('Total R:');
    const status = prompt('Status (Pending/Delivered):');
    const total = parseFloat(totalStr);
    if (!customer || isNaN(total) || !status) {
      alert('Invalid input');
      return;
    }
    const newOrder = { id: orders.length + 1, customer, total, status };
    setOrders([...orders, newOrder]);
  };

  const editOrder = (index) => {
    const order = orders[index];
    const newStatus = prompt('Set status:', order.status);
    if (newStatus) {
      const updatedOrders = [...orders];
      updatedOrders[index] = { ...order, status: newStatus };
      setOrders(updatedOrders);
    }
  };

  const deleteOrder = (index) => {
    const newOrders = [...orders];
    newOrders.splice(index, 1);
    setOrders(newOrders);
  };

  return (
    <div>
      <h3>Orders</h3>
      <button onClick={promptAddOrder}>Add Order</button>
      {orders.length === 0 ? (
        <p>No orders</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={i}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>R {o.total.toFixed(2)}</td>
                <td>{o.status}</td>
                <td>
                  <button onClick={() => editOrder(i)}>Edit</button>
                  <button style={{ backgroundColor: '#f44336' }} onClick={() => deleteOrder(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageOrdersPage;