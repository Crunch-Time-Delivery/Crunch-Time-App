import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey =  process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function PaymentManagementPage() {
  const [transactions, setTransactions] = useState([
    { id: 1, orderId: 101, amount: 150, method: 'Credit Card', status: 'Paid' },
    { id: 2, orderId: 102, amount: 80, method: 'Paypal', status: 'Pending' },
  ]);
  
  return (
    
    
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Payment Management</h2>
      {/* Transactions Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            <th>Transaction ID</th>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.orderId}</td>
              <td>${tx.amount}</td>
              <td>{tx.method}</td>
              <td>{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
  
}

export default PaymentManagementPage

