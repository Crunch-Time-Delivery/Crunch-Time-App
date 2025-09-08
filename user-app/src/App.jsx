import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useState } from 'react';
import { supabase } from './supabaseClient';



function App() {
  // State variables
  const [showModal, setShowModal] = useState({
    menu: false,
    foodOpinion: false,
    food: false,
    orderHistory: false,
    voucher: false,
  });
  const [currentRestaurant, setCurrentRestaurant] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [qrCodeText, setQrCodeText] = useState('');
  const [pendingFoodItem, setPendingFoodItem] = useState(null);
  const [currentQty, setCurrentQty] = useState(1);
  const [foodOpinion, setFoodOpinion] = useState('No preference');

  // Example functions (you'll need to implement all from your script)
  const openModal = (modalName) => {
    setShowModal(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setShowModal(prev => ({ ...prev, [modalName]: false }));
  };

  const showMenu = (restName) => {
    setCurrentRestaurant(restName);
    openModal('menu');
  };

  const toggleFavorite = (e) => {
    // Toggle heart icon
    const target = e.target;
    if (target.innerText === '♥') {
      target.innerText = '♡';
    } else {
      target.innerText = '♥';
    }
  };

  // ... (more handlers for food, order, voucher, etc.)

  // Sample data
  const restaurantMenus = {
    'KFC Parow': [
      { name: 'Zinger Burger', price: 'R50' },
      { name: 'Fries', price: 'R20' },
      { name: 'Cola', price: 'R15' },
    ],
    // Add other restaurant menus
  };

  // Render JSX
  return (
    <div>
      {/* Header */}
      <div className="header">
        <button>&#9776;</button>
        <div>Crunch Time</div>
        <button>Delivery</button>
        <button>Pickup</button>
        <div className="search-bar">
          <input type="text" placeholder="Search Crunch Time" />
        </div>
        <button onClick={() => openModal('map')}>Map Location - Pick up now</button>
      </div>

      {/* Filters */}
      <div className="filters">
        {/* Map your filter buttons similarly */}
        <button>
          <img src="Images/Ultraprocessed foods display 2 framed - shutterstock_2137640529_r.jpg" alt="Fast Food" />
          <span>Fast Food</span>
        </button>
        {/* Other filter buttons */}
      </div>

      {/* Restaurant list */}
      <div className="restaurant-list" id="restaurantList">
        {/* Example restaurant card */}
        <div className="restaurant-card" onClick={() => showMenu('KFC Parow')}>
          <img src="Images/RS KFC .jpeg" alt="KFC Parow" />
          <div className="details">
            <div>KFC, Parow</div>
            <div className="rating">4.4 ★</div>
            <div>Sponsored - 5 min - 4.4 km</div>
          </div>
          <button className="fav" onClick={(e) => { e.stopPropagation(); toggleFavorite(e); }}>♥</button>
        </div>
        {/* Repeat for other restaurants */}
      </div>

      {/* Modals */}
      {showModal.menu && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => closeModal('menu')}>&times;</span>
            {/* Restaurant image, name, menu items, etc. */}
            <img src="" alt="Restaurant" id="restaurantImage" />
            <h2>{currentRestaurant} Menu</h2>
            <div id="menuItems">
              {restaurantMenus[currentRestaurant]?.map((item, index) => (
                <div key={index} className="menu-item" onClick={() => {
                  setPendingFoodItem(item);
                  setCurrentQty(1);
                  openModal('foodOpinion');
                }}>
                  <strong>{item.name}</strong> - {item.price}
                </div>
              ))}
            </div>
            <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${currentRestaurant}`, '_blank')}>
              View Map Location
            </button>
          </div>
        </div>
      )}

      {/* Food Opinion Modal */}
      {showModal.foodOpinion && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <span className="close-btn" onClick={() => closeModal('foodOpinion')}>&times;</span>
            <h3>Tell us your preference</h3>
            <select value={foodOpinion} onChange={(e) => setFoodOpinion(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option>No preference</option>
              <option>Spicy</option>
              <option>Less Salt</option>
              <option>Extra cheese</option>
              <option>No onions</option>
              <option>Less Sugar</option>
              <option>Extra Ice</option>
            </select>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => {
                // Save order with opinion
                if (pendingFoodItem) {
                  setOrderItems(prev => [...prev, { ...pendingFoodItem, quantity: currentQty, opinion: foodOpinion }]);
                }
                closeModal('foodOpinion');
              }}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Food Modal for adding more items */}
      {showModal.food && (
        <div className="food-modal">
          <div className="food-modal-content">
            <span className="food-close-btn" onClick={() => closeModal('food')}>&times;</span>
            <h3>{pendingFoodItem?.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '10px' }}>
              <button onClick={() => setCurrentQty(prev => Math.max(1, prev - 1))}>-</button>
              <span>{currentQty}</span>
              <button onClick={() => setCurrentQty(prev => prev + 1)}>+</button>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => {
                // Add item to order
                if (pendingFoodItem) {
                  setOrderItems(prev => [...prev, { ...pendingFoodItem, quantity: currentQty }]);
                }
                closeModal('food');
              }}>Add to Order</button>
              <button onClick={() => closeModal('food')}>Exit</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div id="orderSummary" style={{ padding: '10px', background: '#fff', margin: '10px' }}>
        <h4>Order Summary</h4>
        <ul>
          {orderItems.map((item, index) => (
            <li key={index}>
              {item.name} x{item.quantity} @ {item.price}
              {item.opinion && item.opinion !== 'No preference' && (
                <div>Preference: {item.opinion}</div>
              )}
              <button onClick={() => {
                setOrderItems(prev => prev.filter((_, i) => i !== index));
              }}>Remove</button>
            </li>
          ))}
        </ul>
        {/* Checkout & other buttons */}
        <button onClick={() => {
          if (orderItems.length === 0) { alert('Your cart is empty!'); return; }
          // Save order to history
          setOrderHistory(prev => [...prev, { restaurant: currentRestaurant, items: [...orderItems], date: new Date() }]);
          // Calculate total
          let total = 0;
          orderItems.forEach(i => {
            const p = parseFloat(i.price.replace('R', ''));
            total += p * i.quantity;
          });
          total -= discountAmount;
          if (total < 0) total = 0;
          // Show checkout
          // You can implement a state to show/hide checkout page
        }}>Go to Checkout</button>
        {/* ... other buttons like Order History, Input Voucher */}
      </div>

      {/* Checkout Page */}
      {/* ... implement similarly, with conditions */}

      {/* Order History Modal, Voucher modal, etc. */}

    </div>
  );
}
useEffect(() => {
  const subscription = supabase
    .from('notifications')
    .on('INSERT', payload => {
      console.log('New notification:', payload.new);
      // handle the new data, e.g., show notification or update state
    })
    .subscribe();

  return () => {
    supabase.removeSubscription(subscription);
  };
}, []);
const sendNotification = async (data) => {
  await supabase.from('notifications').insert([{ ...data }]);
};
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const handlePayNow = () => {
    if (!selectedCard) {
      alert('Please select a payment method.');
      return;
    }

    // Call your backend to create the PayFast payment URL
    fetch('/create-payfast-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100.00, // Example amount
        item_name: 'Sample Item',
        card_type: selectedCard, // optional if needed
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.paymentUrl) {
          // Redirect user to PayFast
          window.location.href = data.paymentUrl;
        } else {
          alert('Error generating payment URL.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to initiate payment.');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Choose Your Payment Method</h1>

      {/* Payment Options */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
        {/* Visa */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            border: selectedCard === 'Visa' ? '2px solid blue' : '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
          }}
          onClick={() => handleCardSelect('Visa')}
        >
          <img
            src="https://img.icons8.com/color/48/000000/visa.png"
            alt="Visa"
            style={{ width: '50px', height: '30px' }}
          />
          <span>Visa</span>
        </div>

        {/* MasterCard */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            border: selectedCard === 'MasterCard' ? '2px solid blue' : '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
          }}
          onClick={() => handleCardSelect('MasterCard')}
        >
          <img
            src="https://img.icons8.com/color/48/000000/mastercard-logo.png"
            alt="MasterCard"
            style={{ width: '50px', height: '30px' }}
          />
          <span>MasterCard</span>
        </div>

        {/* Amex */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            border: selectedCard === 'Amex' ? '2px solid blue' : '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
          }}
          onClick={() => handleCardSelect('Amex')}
        >
          <img
            src="https://img.icons8.com/color/48/000000/amex.png"
            alt="American Express"
            style={{ width: '50px', height: '30px' }}
          />
          <span>Amex</span>
        </div>
      </div>

      {/* Pay Now Button */}
      <button
        style={{ marginTop: '30px', padding: '10px 20px', fontSize: '16px' }}
        onClick={handlePayNow}
      >
        Pay Now
      </button>
    </div>
  );
 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailText, setEmailText] = useState('');
  const [status, setStatus] = useState('');

  const sendSMS = () => {
    fetch('/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phoneNumber, message: smsMessage }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('SMS sent! SID: ' + data.sid);
        } else {
          setStatus('Failed to send SMS.');
        }
      })
      .catch((err) => setStatus('Error: ' + err.message));
  };

  const sendEmail = () => {
    fetch('/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, subject: emailSubject, text: emailText }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('Email sent!');
        } else {
          setStatus('Failed to send email.');
        }
      })
      .catch((err) => setStatus('Error: ' + err.message));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Send SMS & Email</h1>
      
      {/* SMS Section */}
      <h2>Send SMS</h2>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        style={{ width: '300px', marginBottom: '10px' }}
      />
      <br />
      <textarea
        placeholder="Message"
        value={smsMessage}
        onChange={(e) => setSmsMessage(e.target.value)}
        style={{ width: '300px', height: '80px', marginBottom: '10px' }}
      />
      <br />
      <button onClick={sendSMS}>Send SMS</button>
      
      {/* Email Section */}
      <h2 style={{ marginTop: '30px' }}>Send Email</h2>
      <input
        type="email"
        placeholder="Recipient Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '300px', marginBottom: '10px' }}
      />
      <br />
      <input
        type="text"
        placeholder="Subject"
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
        style={{ width: '300px', marginBottom: '10px' }}
      />
      <br />
      <textarea
        placeholder="Email Body"
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        style={{ width: '300px', height: '100px', marginBottom: '10px' }}
      />
      <br />
      <button onClick={sendEmail}>Send Email</button>

      <p style={{ marginTop: '20px' }}>{status}</p>
    </div>
  );


export default App;
