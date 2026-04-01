import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { createOrderData } from './orderData.js';
async function fetchExistingOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching existing orders:', error);
  } else {
    // Process existing orders, e.g. display in UI
    console.log('Existing orders:', data);
  }
}
// Example of inserting into Supabase:
async function saveOrder() {
  const order = createOrderData(
    'ORD123456',
    'user_abc123',
    [
      { name: 'Pizza Margherita', qty: 2, price: 150.00, image: '', restaurant: 'Pizza Place' },
      { name: 'Coke', qty: 1, price: 20.00, image: '', restaurant: 'Pizza Place' }
    ],
    320.00,
    'inProgress'
  );
  
  const { data, error } = await supabase.from('orders').insert([order]);
  if (error) {
    console.error('Error saving order:', error);
  } else {
    console.log('Order saved:', data);
  }
}
function OrdersPage() {
  const [cart, setCart] = useState([]);
  const [tab, setTab] = useState('inProgress');
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState('0.00');

  // Fetch cart items from Supabase on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Recalculate total whenever cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotalPrice(total.toFixed(2));
  }, [cart]);

  const fetchCartItems = async () => {
    const { data, error } = await supabase.from('cart_items').select('*');
    if (error) {
      console.error('Error fetching cart items:', error);
    } else {
      setCart(data || []);
    }
  };

  const addItemToCart = async (item) => {
    await supabase.from('cart_items').insert([item]);
    fetchCartItems(); // refresh cart
  };

  const handleRemove = async (id) => {
    await supabase.from('cart_items').delete().eq('id', id);
    fetchCartItems();
  };

  const handleQtyChange = async (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQty = item.qty + delta;
    if (newQty <= 0) return handleRemove(id);
    await supabase.from('cart_items').update({ qty: newQty }).eq('id', id);
    fetchCartItems();
  };

  // Notification function
  const sendSMSNotification = (message) => {
    fetch('http://localhost:3000/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: '+1234567890', message }),
    });
  };

  // Handle tab change
  const handleTabChange = (newTab) => {
    setTab(newTab);
    if (newTab === 'inProgress') {
      sendSMSNotification('Your order is now in progress.');
    } else if (newTab === 'completed') {
      sendSMSNotification('Your order has been completed.');
    }
  };

  // For demo: a sample function to add an item
  const handleAddSampleItem = () => {
    const item = {
      name: 'Sample Item',
      price: 10,
      restaurant: 'Sample Restaurant',
      qty: 1,
      image: '', // optional
    };
    addItemToCart(item);
  };

  return (
    <div>
      {/* HEADER */}
      <header style={{ display: 'flex', alignItems: 'center', padding: '14px', background: '#fff' }}>
        <button onClick={() => window.history.back()}>←</button>
        <h1 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '18px' }}>My Orders</h1>
      </header>

      {/* TABS */}
      <div style={{
        display: 'flex', margin: '15px', background: '#eee', borderRadius: '14px', overflow: 'hidden'
      }}>
        <div
          style={{
            flex: 1, padding: '12px 0', textAlign: 'center', fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: tab === 'inProgress' ? 'red' : 'transparent',
            color: tab === 'inProgress' ? '#fff' : 'black'
          }}
          onClick={() => handleTabChange('inProgress')}
        >
          In Progress
        </div>
        <div
          style={{
            flex: 1, padding: '12px 0', textAlign: 'center', fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: tab === 'completed' ? '#ffcc00' : 'transparent'
          }}
          onClick={() => handleTabChange('completed')}
        >
          Completed
        </div>
      </div>

      {/* CONTENT for In Progress */}
      {tab === 'inProgress' && (
        <div style={{ margin: '15px' }}>
          <div style={{
            background: '#fff', borderRadius: '18px', padding: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>My Cart</strong>
              <span style={{ color: 'red', fontWeight: 'bold' }}>35 min</span>
            </div>
            {/* Cart Items */}
            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#777' }}>Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', marginTop: '12px' }}>
                  <img
                    src={item.image || 'Images/RS KOTA .jpg'}
                    alt={item.name}
                    style={{ width: '80px', height: 'auto', borderRadius: '14px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, marginLeft: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      <button
                        style={{ background: 'none', border: 'none', color: 'red', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div>{item.restaurant}</div>
                    <div style={{ marginTop: '4px', fontWeight: 'bold' }}>R{item.price.toFixed(2)}</div>
                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', gap: '5px' }}>
                      <button
                        style={{ width: '30px', height: '30px', border: 'none', borderRadius: '8px', background: '#eee', fontSize: '18px', cursor: 'pointer' }}
                        onClick={() => handleQtyChange(item.id, -1)}
                      >
                        −
                      </button>
                      <span style={{ fontWeight: 'bold' }}>{item.qty}</span>
                      <button
                        style={{ width: '30px', height: '30px', border: 'none', borderRadius: '8px', background: '#eee', fontSize: '18px', cursor: 'pointer' }}
                        onClick={() => handleQtyChange(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CONTENT for Completed */}
      {tab === 'completed' && (
        <div style={{ margin: '15px', textAlign: 'center', color: '#777' }}>
          <p>No completed orders yet</p>
        </div>
      )}

      {/* Checkout Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', display: 'flex', justifyContent: 'space-between',
        padding: '15px', boxShadow: '0 -3px 10px rgba(0,0,0,0.1)'
      }}>
        <button
          style={{
            background: '#ff0011', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold'
          }}
          onClick={() => setShowAddonModal(true)}
        >
          + Add-on Menu
        </button>
        <strong style={{ alignSelf: 'center' }}>R{totalPrice}</strong>
        <button
          style={{
            background: 'red', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: '#fff'
          }}
          onClick={() => window.location.href = 'checkout.html'}
        >
          Checkout
        </button>
      </div>

      {/* ADD-ON MODAL */}
      {showAddonModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            position: 'relative',
            width: '90%', maxWidth: '500px',
            height: '80%',
            background: '#fff',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #eee' }}>
              <strong>Select Items</strong>
              <button onClick={() => setShowAddonModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <iframe
              src="http://127.0.0.1:5501/user-app/client/public/restaurant_info.html"
              style={{ flex: 1, border: 'none' }}
              title="Addon Menu"
            ></iframe>
          </div>
        </div>
      )}

      {/* Button to add a sample item for demo purposes */}
      {/* Remove or replace with actual event from iframe */}
      <button style={{ margin: '20px' }} onClick={handleAddSampleItem}>Add Sample Item</button>
    </div>
  );
}

export default OrdersPage;