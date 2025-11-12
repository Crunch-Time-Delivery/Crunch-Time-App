import React from 'react';

function OrderSummary({ orderItems, total, removeItem, handleCheckout, handleOrderHistory, handleVoucher }) {
  return (
    <div style={{ padding: '10px 20px', background: '#fff', margin: '10px' }}>
      <h4>Order Summary</h4>
      <ul>
        {orderItems.map((item, idx) => (
          <li key={idx}>
            {item.name} x{item.quantity} @ {item.price}
            {item.opinion && item.opinion !== 'No preference' ? (
              <div>Opinion: {item.opinion}</div>
            ) : null}
            <button style={{ marginLeft: '10px' }} onClick={() => removeItem(idx)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Total: R{total.toFixed(2)}</h3>
      <button
        style={{
          padding: '15px',
          background: '#f00',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          width: '100%',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
        onClick={handleCheckout}
      >
        Go to Checkout
      </button>
      <button
        style={{
          background: 'red',
          color: '#fff',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          marginTop: '10px',
          width: '100%',
          fontWeight: 'bold',
        }}
        onClick={handleOrderHistory}
      >
        Order History
      </button>
      <button
        style={{
          backgroundColor: '#f80505',
          color: '#fff',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          marginTop: '10px',
          width: '100%',
          fontWeight: 'bold',
        }}
        onClick={handleVoucher}
      >
        Input Voucher Coupon
      </button>
    </div>
  );
}

export default OrderSummaryPage;