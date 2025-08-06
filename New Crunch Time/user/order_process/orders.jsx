import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function ReceiptOrderPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('Reciept_Order')
      .select('*')
      .range(0, 9) // first 10 records
    if (error) {
      setError(error.message)
    } else {
      setOrders(data)
    }
    setLoading(false)
  }

  return (
    <div className="orders-container">
      <h2>Receipt Orders</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Some Column</th>
            <th>Other Column</th>
            {/* add more headers as per your table */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.some_column}</td>
              <td>{order.other_column}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReceiptOrderPage
