import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function ManageOrderPage() {
  const [orders, setOrders] = useState([
    { id: 101, customer: 'Alice', total: 150, status: 'Pending' },
    { id: 102, customer: 'Bob', total: 80, status: 'Delivered' },
  ]);
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredOrders = orders.filter(order => filterStatus === 'All' || order.status === filterStatus);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Order Management</h2>
      {/* Filter */}
      <div style={{ marginBottom: '1em' }}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Delivered</option>
        </select>
      </div>
      {/* Orders Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>${order.total}</td>
              <td>{order.status}</td>
              <td>
                <button>View</button>
                <button>Update Status</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageOrderPage