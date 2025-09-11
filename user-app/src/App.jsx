import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useState } from 'react';
import './database.jsx'; // your real-time notifications
import  './mapAPI.jsx'; // map display
import  './PayfastAPI.jsx'; // payment process
import './smsAndEmailAPI.jsx'; // SMS & email
import './supabaseClient.js';
import './createPayFastPayment.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function generateRandomPIN() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
const [total, setTotal] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [driverPosition, setDriverPosition] = useState([ -33.9129, 18.4179 ]);
  const driverIntervalRef = useRef(null);
  const [orderPIN, setOrderPIN] = useState('');



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
const handleOrder = () => {
    // Calculate total
    let sum = 0;
    orderItems.forEach(i => {
      sum += i.price * i.quantity;
    });
    setTotal(sum);
    // Generate PIN
    const pin = generateRandomPIN();
    setOrderPIN(pin);
    // Save order
    setOrderHistory(prev => [...prev, { items: orderItems, date: new Date(), restaurant: currentRestaurant, pin }]);
    alert(`Order placed! Your driver PIN is: ${pin}`);
    // Reset order
    setOrderItems([]);
  };

  const handleShowOrderDetails = (order) => {
    alert(
      `Order from ${order.restaurant}\nItems:\n` +
      order.items.map(i => `${i.name} x${i.quantity} @ R${i.price}`).join('\n') +
      `\nOrder PIN: ${order.pin}`
    );
  };

  const handleShowMap = () => {
    setShowMap(true);
    // simulate driver movement
    if (driverIntervalRef.current) clearInterval(driverIntervalRef.current);
    driverIntervalRef.current = setInterval(() => {
      setDriverPosition(pos => [
        pos[0] + (Math.random() - 0.5) * 0.01,
        pos[1] + (Math.random() - 0.5) * 0.01
      ]);
    }, 3000);
  };

  const handleCloseMap = () => {
    setShowMap(false);
    if (driverIntervalRef.current) clearInterval(driverIntervalRef.current);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React Food Order</h1>
      
      {/* Example restaurant selection */}
      <div>
        <h2>Select Restaurant</h2>
        {Object.keys(restaurantMenus).map(rest => (
          <button key={rest} onClick={() => setCurrentRestaurant(rest)} style={{ marginRight: '10px' }}>
            {rest}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      {currentRestaurant && (
        <div>
          <h3>{currentRestaurant} Menu</h3>
          {restaurantMenus[currentRestaurant].map((item, idx) => (
            <div key={idx} style={{ marginBottom: '5px' }}>
              <span>{item.name} - R{item.price}</span>
              <button style={{ marginLeft: '10px' }} onClick={() => addItem(item)}>Add</button>
            </div>
          ))}
        </div>
      )}

      {/* Order Summary */}
      <div style={{ marginTop: '20px' }}>
        <h3>Order Summary</h3>
        {orderItems.length === 0 ? (
          <p>No items added</p>
        ) : (
          <ul>
            {orderItems.map((it, idx) => (
              <li key={idx}>{it.name} x{it.quantity} @ R{it.price}</li>
            ))}
          </ul>
        )}
        <button onClick={handleOrder} disabled={orderItems.length === 0}>Place Order</button>
      </div>

      {/* Order History */}
      <div style={{ marginTop: '20px' }}>
        <h3>Order History</h3>
        {orderHistory.length === 0 ? (
          <p>No previous orders</p>
        ) : (
          orderHistory.map((order, idx) => (
            <div key={idx} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p>Order from: {order.restaurant}</p>
              <p>Date: {new Date(order.date).toLocaleString()}</p>
              <button onClick={() => handleShowOrderDetails(order)}>View Details</button>
            </div>
          ))
        )}
      </div>

      {/* Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleShowMap}>Track Driver</button>
      </div>

      {/* Map Modal */}
      {showMap && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{ width: '90%', height: '80%', position: 'relative', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <button onClick={handleCloseMap} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>Close</button>
            <MapContainer center={driverPosition} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={driverPosition}>
                <Popup>Driver Location</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );



export default App;
