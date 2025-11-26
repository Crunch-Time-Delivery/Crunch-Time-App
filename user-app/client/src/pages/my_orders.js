import React, { useState } from 'react';

function MyOrders() {
  const [activeTab, setActiveTab] = useState('inProgress');
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({ message: '', visible: false, color: '#4CAF50' });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const changeQuantity = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const showNotificationMessage = (message, color = '#4CAF50') => {
    setNotification({ message, visible: true, color });
    setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
  };

  const sendTwilioNotification = (to, message) => {
    showNotificationMessage('Sending notification...');
    fetch('/notify/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showNotificationMessage('Notification sent successfully!', '#4CAF50');
        } else {
          showNotificationMessage('Failed to send notification.', '#f44336');
        }
      })
      .catch(() => {
        showNotificationMessage('Error sending notification.', '#f44336');
      });
  };

  const goToCheckout = () => {
    window.location.href = 'http://127.0.0.1:5501/user-app/client/public/checkout.html';
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, backgroundColor: '#f0f0f0' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#fff' }}>
        <button
          onClick={() =>
            (window.location.href =
              'http://127.0.0.1:5501/user-app/client/public/restaurant_info.html')
          }
        >
          &larr;
        </button>
        <h1 style={{ flex: 1, margin: 0, fontSize: '20px', textAlign: 'center' }}>My Orders</h1>
      </header>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          margin: '10px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 0 5px rgba(0,0,0,0.1)',
        }}
      >
        <div
          className={`tab ${activeTab === 'inProgress' ? 'in-progress' : ''}`}
          style={{
            flex: 1,
            padding: '10px 0',
            textAlign: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            backgroundColor: activeTab === 'inProgress' ? 'red' : 'transparent',
            color: activeTab === 'inProgress' ? '#fff' : '#000',
          }}
          onClick={() => handleTabChange('inProgress')}
        >
          In Progress
        </div>
        <div
          className={`tab ${activeTab === 'completed' ? 'completed' : ''}`}
          style={{
            flex: 1,
            padding: '10px 0',
            textAlign: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            backgroundColor: activeTab === 'completed' ? 'yellow' : 'transparent',
            color: activeTab === 'completed' ? '#333' : '#000',
          }}
          onClick={() => handleTabChange('completed')}
        >
          Completed
        </div>
      </div>

      {/* In Progress Content */}
      {activeTab === 'inProgress' && (
        <div style={{ backgroundColor: '#fff', margin: '10px', borderRadius: '8px', padding: '10px' }}>
          {/* Cart Section */}
          <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>My Cart</div>
              <div style={{ color: 'red' }}>35 min</div>
            </div>
            {/* Item */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <img src="Images/RS KOTA .jpg" alt="DK Spot & Kota" style={{ width: '80px', height: '80px', borderRadius: '8px' }} />
              <div style={{ flex: 1, marginLeft: '10px' }}>
                <div style={{ fontWeight: 'bold' }}>Sandwich Tatuni</div>
                <div style={{ fontSize: '12px', color: '#555' }}>Sandwich</div>
                <div style={{ marginTop: '5px', fontWeight: 'bold' }}>
                  R18.50
                  <span style={{ textDecoration: 'line-through', color: '#888', marginLeft: '10px' }}>R22.50</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                  {/* Placeholder SVG icon */}
                  <svg viewBox="0 0 24 24" fill="orange" style={{ width: '16px', height: '16px', marginRight: '5px' }}>
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span>Free delivery</span>
                </div>
                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                  <button onClick={() => changeQuantity(-1)} style={{ width: '25px', height: '25px', fontSize: '20px', border: 'none', backgroundColor: '#ccc', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                  <div style={{ margin: '0 10px', fontWeight: 'bold' }} id="quantity">{quantity}</div>
                  <button onClick={() => changeQuantity(1)} style={{ width: '25px', height: '25px', fontSize: '20px', border: 'none', backgroundColor: '#ccc', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                </div>
                {/* Order Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <div>R 18.50</div>
                </div>
              </div>
            </div>
            <button
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                backgroundColor: '#eee',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() => {/* implement addMoreItems logic */}}
            >
              + add more items
            </button>
          </div>
          {/* Total */}
          <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '16px' }}>R 18.50</div>
          {/* Checkout Button */}
          <button
            style={{
              display: 'block',
              width: '100%',
              backgroundColor: '#e53935',
              color: '#fff',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '20px',
            }}
            onClick={goToCheckout}
          >
            Go to Check out
          </button>
        </div>
      )}

      {/* Completed Content */}
      {activeTab === 'completed' && (
        <div style={{ margin: '10px' }}>
          {/* Example order */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img src="Images/RS KOTA .jpg" alt="DK Spot & Kota" style={{ width: '50px', height: '50px', borderRadius: '8px' }} />
            <div style={{ marginLeft: '10px' }}>
              <div style={{ fontWeight: 'bold' }}>DK Spot & Kota Restaurant</div>
              <div style={{ fontSize: '12px', color: '#555' }}>Delivered</div>
              <div style={{ fontSize: '12px', color: '#555' }}>R76.89</div>
              <div style={{ fontSize: '12px', color: '#555' }}>05 Oct, 2021 13:45</div>
            </div>
          </div>
          {/* Add more orders as needed */}
        </div>
      )}

      {/* Notification */}
      {notification.visible && (
        <div style={{ position: 'fixed', top: '20px', width: '100%', zIndex: 9999, textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: notification.color,
              color: 'white',
              padding: '10px',
              display: 'inline-block',
              borderRadius: '4px',
            }}
          >
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;