import React, { useState, useEffect } from 'react';

function RestaurantPage() {
  const [restaurantName, setRestaurantName] = useState('Restaurant Details');
  const [restaurantImage, setRestaurantImage] = useState('');
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showFoodOpinionModal, setShowFoodOpinionModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentFoodItem, setCurrentFoodItem] = useState('');
  const [foodOpinion, setFoodOpinion] = useState('No preference');

  // Fetch URL params and set restaurant info
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    const imageMap = {
      'KFC Parow': 'Images/RS KFC .jpeg',
      'Sannes Palace': 'Images/RS PALACE .jpg',
      'DK Spot & Kota': 'Images/RS KOTA .jpg',
      'Nondyebo Eatery': 'Images/RS NONDYEBO.jpg'
    };

    if (nameParam && imageMap[nameParam]) {
      setRestaurantName(`${nameParam} Menu`);
      setRestaurantImage(imageMap[nameParam]);
    }
  }, []);

  // Handlers for modals
  const openMenuModal = () => setShowMenuModal(true);
  const closeMenuModal = () => setShowMenuModal(false);
  const openFoodOpinionModal = () => setShowFoodOpinionModal(true);
  const closeFoodOpinionModal = () => setShowFoodOpinionModal(false);
  const openFoodModal = (foodItem) => {
    setCurrentFoodItem(foodItem);
    setFoodQuantity(1);
    setShowFoodModal(true);
  };
  const closeFoodModal = () => setShowFoodModal(false);

  // Quantity controls
  const changeQuantity = (delta) => {
    setFoodQuantity(prev => Math.max(1, prev + delta));
  };

  // Add item to order
  const addItemToOrder = () => {
    // Implement adding item logic here
    alert(`Added ${currentFoodItem} x${foodQuantity} with opinion: ${foodOpinion}`);
    setFoodOpinion('No preference');
    closeFoodModal();
  };

  // Notification
  const showNotification = () => {
    setNotificationVisible(true);
    setTimeout(() => setNotificationVisible(false), 2000);
  };

  // Placeholder functions for other actions
  const handleViewMap = () => {
    // show map location logic
  };

  const handleConfirmFoodOpinion = () => {
    // handle opinion confirmation
    closeFoodOpinionModal();
    // maybe open food modal or other logic
  };

  return (
    <div>
      <h1>Restaurant Details</h1>

      {/* Modal for Restaurant Menu */}
      {showMenuModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeMenuModal}>&times;</span>
            <img src={restaurantImage} alt="Restaurant Image" />
            <h2>{restaurantName}</h2>
            <div id="menuItems">
              {/* Populate menu items here */}
              <button onClick={() => openFoodModal('Sample Food Item')}>Sample Food Item</button>
            </div>
            <button className="view-map-btn" onClick={handleViewMap}>View Map Location</button>
          </div>
        </div>
      )}

      {/* Food Opinion Modal */}
      {showFoodOpinionModal && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <span className="close-btn" onClick={closeFoodOpinionModal}>&times;</span>
            <h3>Tell us your preference</h3>
            <select
              style={{ width: '100%', padding: '8px' }}
              value={foodOpinion}
              onChange={(e) => setFoodOpinion(e.target.value)}
            >
              <option>No preference</option>
              <option>Spicy</option>
              <option>Less Salt</option>
              <option>Extra cheese</option>
              <option>No onions</option>
              <option>Less Sugar</option>
              <option>Extra Ice</option>
            </select>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <button className="add-more-btn" onClick={handleConfirmFoodOpinion}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Food Item Modal */}
      {showFoodModal && (
        <div className="food-modal">
          <div className="food-modal-content">
            <span className="food-close-btn" onClick={closeFoodModal}>&times;</span>
            <h3 id="foodItemName">{currentFoodItem}</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '10px' }}>
              <button className="quantity-btn" onClick={() => changeQuantity(-1)}>-</button>
              <span id="foodQuantity">{foodQuantity}</span>
              <button className="quantity-btn" onClick={() => changeQuantity(1)}>+</button>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <button className="add-more-btn" onClick={addItemToOrder}>Add to Order</button>
              <button className="exit-btn" onClick={closeFoodModal}>Exit</button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <a
        href="http://127.0.0.1:5501/user-app/client/public/my_order.html"
        style={{
          display: 'inline-block',
          width: '100%',
          backgroundColor: 'red',
          color: '#fff',
          padding: '15px',
          textAlign: 'center',
          textDecoration: 'none',
          fontWeight: 'bold',
          borderRadius: '5px',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        Checkout
      </a>

      {/* Notification */}
      {notificationVisible && (
        <div style={{
          display: 'block',
          position: 'fixed',
          top: '20px',
          width: '100%',
          zIndex: 9999,
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px',
            display: 'inline-block',
            borderRadius: '4px'
          }}>
            Sending notification...
          </div>
        </div>
      )}

      {/* Optional: Load external scripts if needed, or replace with React logic */}
    </div>
  );
}

export default RestaurantPage;