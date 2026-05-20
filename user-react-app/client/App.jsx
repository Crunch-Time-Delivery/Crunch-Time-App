import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import reactLogo from './assets/react.svg'; // if used
import viteLogo from '/vite.svg'; // if used
import './App.css';

// Assuming you import these scripts or they are global
import './src/database.jsx';
import './src/mapAPI.jsx';
import './src/PayfastAPI.jsx';
import './src/smsAndEmailAPI.jsx';
import './supabaseClient.js';
import './createPayFastPayment.js';

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

  // Handlers
  const openModal = (modalName) => setShowModal(prev => ({ ...prev, [modalName]: true }));
  const closeModal = (modalName) => setShowModal(prev => ({ ...prev, [modalName]: false }));
  const showMenu = (restName) => {
    setCurrentRestaurant(restName);
    openModal('menu');
  };
  const toggleFavorite = (e) => {
    e.stopPropagation();
    const target = e.target;
    target.innerText = target.innerText === '♥' ? '♡' : '♥';
  };

  const handleShowMap = () => {
    setShowMap(true);
    if (driverIntervalRef.current) clearInterval(driverIntervalRef.current);
    driverIntervalRef.current = setInterval(() => {
      setDriverPosition(pos => [
        pos[0] + (Math.random() - 0.5) * 0.01,
        pos[1] + (Math.random() - 0.5) * 0.01,
      ]);
    }, 3000);
  };

  const handleCloseMap = () => {
    setShowMap(false);
    if (driverIntervalRef.current) clearInterval(driverIntervalRef.current);
  };

  const handleOrder = () => {
    if (orderItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // Calculate total
    let sum = 0;
    orderItems.forEach(i => {
      const price = parseFloat(i.price.replace('R', ''));
      sum += price * i.quantity;
    });
    setTotal(sum - discountAmount);
    const pin = generateRandomPIN();
    setOrderPIN(pin);
    setOrderHistory(prev => [...prev, { restaurant: currentRestaurant, items: [...orderItems], date: new Date(), pin }]);
    alert(`Order placed! Your driver PIN is: ${pin}`);
    setOrderItems([]); // Reset cart
  };

  const handleShowOrderDetails = (order) => {
    alert(
      `Order from ${order.restaurant}\nItems:\n` +
      order.items.map(i => `${i.name} x${i.quantity} @ R${i.price}`).join('\n') +
      `\nOrder PIN: ${order.pin}`
    );
  };

  // Sample restaurant menu data
  const restaurantMenus = {
    'KFC Parow': [
      { name: 'Zinger Burger', price: 'R50' },
      { name: 'Fries', price: 'R20' },
      { name: 'Cola', price: 'R15' },
    ],
    // Add more restaurants as needed
  };

  const addItem = (item) => {
    setPendingFoodItem(item);
    setCurrentQty(1);
    openModal('foodOpinion');
  };

  const confirmOrderItem = () => {
    if (pendingFoodItem) {
      setOrderItems(prev => [...prev, { ...pendingFoodItem, quantity: currentQty, opinion: foodOpinion }]);
    }
    closeModal('foodOpinion');
  };

  // JSX
  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <header className="header">
        <button>&#9776;</button>
        <div>Crunch Time</div>
        <button>Delivery</button>
        <button>Pickup</button>
        <div className="search-bar">
          <input type="text" placeholder="Search Crunch Time" />
        </div>
        <button onClick={() => openModal('map')}>Map Location - Pick up now</button>
      </header>

      {/* Filters */}
      <div className="filters">
        {/* Example filter button */}
        <button>
          <img src="Images/Ultraprocessed foods display 2 framed - shutterstock_2137640529_r.jpg" alt="Fast Food" />
          <span>Fast Food</span>
        </button>
        {/* Add more filter buttons as needed */}
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

      {/* Modal: Restaurant Menu */}
      {showModal.menu && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => closeModal('menu')}>&times;</span>
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

      {/* Modal: Food Opinion */}
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
              <button onClick={confirmOrderItem}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Food Item */}
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
        {orderItems.length === 0 ? (
          <p>No items added</p>
        ) : (
          <ul>
            {orderItems.map((item, index) => (
              <li key={index}>
                {item.name} x{item.quantity} @ {item.price}
                {item.opinion && item.opinion !== 'No preference' && (
                  <div>Preference: {item.opinion}</div>
                )}
                <button onClick={() => setOrderItems(prev => prev.filter((_, i) => i !== index))}>Remove</button>
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleOrder} disabled={orderItems.length === 0}>Place Order</button>
      </div>

      {/* Map Modal */}
      {showMap && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{ width: '90%', height: '80%', background: '#fff', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
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
}

export default App;