import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY'; // replace with your env or directly
const supabase = createClient(supabaseUrl, supabaseKey);

function OrderDetail() {
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const { data, error } = await supabase
        .from('order_detail')
        .select('*, some_column, other_table(*)') // adjust based on your schema
        .limit(10);
      if (error) {
        console.error(error);
      } else {
        setOrderDetails(data);
      }
    };
    fetchOrderDetails();
  }, []);

  return (
    <div className="order-detail-container">
      <h1>Restaurant Info</h1>
      {orderDetails.length > 0 ? (
        orderDetails.map((detail, index) => (
          <div key={index} className="order-item">
            <p>Order ID: {detail.id}</p>
            <p>Some Column: {detail.some_column}</p>
            {/* Add more fields as necessary */}
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      )}
    </div>
  );
}

export default OrderDetail;