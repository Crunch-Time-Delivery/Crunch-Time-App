import React, { useState, useEffect } from 'react';
import OrderSummary from './OrderSummary'; // Make sure this path matches your project structure

function App() {
  const restaurantMenus = {
    'KFC Parow': [
      { name: 'Zinger Burger', price: 'R50' },
      { name: 'Fries', price: 'R20' },
      { name: 'Cola', price: 'R15' },
    ],
    'Sannes Palace': [
      { name: 'Chicken Curry', price: 'R80' },
      { name: 'Veggie Plate', price: 'R60' },
      { name: 'Lemonade', price: 'R10' },
    ],
    'DK Spot & Kota': [
      { name: 'Kota Special', price: 'R25' },
      { name: 'Fries', price: 'R20' },
      { name: 'Soda', price: 'R15' },
    ],
    'Nondyebo Eatery': [
      { name: 'Wrap', price: 'R40' },
      { name: 'Salad', price: 'R35' },
      { name: 'Juice', price: 'R12' },
    ],
  };

  // State variables
  const [showModal, setShowModal] = useState(null);
  const [restaurantList, setRestaurantList] = useState([
    {
      name: 'KFC Parow',
      image: 'Images/RS KFC .jpeg',
      rating: 4.4,
      promo: null,
      distance: '4.4 km',
      time: '5 min',
    },
    {
      name: 'Sannes Palace',
      image: 'Images/RS PALACE .jpg',
      rating: 4.5,
      promo: 'Spend ZAR 100, Save ZAR 15',
      distance: '0.5 km',
      time: '20 min',
    },
    {
      name: 'DK Spot & Kota',
      image: 'Images/RS KOTA .jpg',
      rating: 4.0,
      promo: null,
      distance: '0.6 km',
      time: '16 min',
    },
    {
      name: 'Nondyebo Eatery',
      image: 'Images/RS NONDYEBO.jpg',
      rating: 3.3,
      promo: null,
      distance: '0.6 km',
      time: '10 min',
    },
  ]);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');
  const [total, setTotal] = useState(0);
  const [pendingFoodItem, setPendingFoodItem] = useState(null);
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [foodOpinion, setFoodOpinion] = useState('No preference');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  // Handlers
  const openModal = (name) => setShowModal(name);
  const closeModal = () => setShowModal(null);

  const handleShowMenu = (restName) => {
    setCurrentRestaurant(restName);
    openModal('menu');
  };

  const handleAddFoodWithOpinion = () => {
    if (pendingFoodItem) {
      setOrderItems([
        ...orderItems,
        {
          ...pendingFoodItem,
          quantity: foodQuantity,
          opinion: foodOpinion,
        },
      ]);
    }
    closeModal();
  };

  const handleAddFood = (foodItem) => {
    setOrderItems([
      ...orderItems,
      {
        ...foodItem,
        quantity: 1,
        opinion: 'No preference',
      },
    ]);
    closeModal();
  };

  const removeItem = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const handleCheckout = () => {
    if (orderItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setOrderHistory([
      ...orderHistory,
      { restaurant: currentRestaurant, items: [...orderItems], date: new Date() },
    ]);
    setShowCheckout(true);
  };

  const confirmEFT = () => {
    alert('Your EFT payment has been processed successfully. Thank you!');
    setOrderItems([]);
    setShowCheckout(false);
  };

  const handleVoucherInput = () => {
    if (voucherCode.trim() === 'DISCOUNT10') {
      setDiscountAmount(10);
      alert('Voucher applied! R10 off.');
    } else {
      setDiscountAmount(0);
      alert('Invalid code');
    }
  };

  const handleViewOrderHistory = () => {
    setShowOrderHistory(true);
  };

  const getRestaurantImage = (restName) => {
    switch (restName) {
      case 'KFC Parow':
        return 'Images/RS KFC .jpeg';
      case 'Sannes Palace':
        return 'Images/RS PALACE .jpg';
      case 'DK Spot & Kota':
        return 'Images/RS KOTA .jpg';
      case 'Nondyebo Eatery':
        return 'Images/RS NONDYEBO.jpg';
      default:
        return '';
    }
  };

  // useEffect to update total when orderItems or discount change
  useEffect(() => {
    let totalAmount = 0;
    orderItems.forEach((item) => {
      const price = parseFloat(item.price.replace('R', ''));
      totalAmount += price * item.quantity;
    });
    totalAmount -= discountAmount;
    if (totalAmount < 0) totalAmount = 0;
    setTotal(totalAmount);
  }, [orderItems, discountAmount]);

  return (
    <div>
      {/* Header */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#fff', borderBottom: '1px solid #ddd' }}>
        <button>&#9776;</button>
        <div>Crunch Time</div>
        <button>Delivery</button>
        <button>Pickup</button>
        <div className="search-bar" style={{ flex: 1, minWidth: '200px', margin: '10px' }}>
          <input type="text" placeholder="Search Crunch Time" style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '5px' }} />
        </div>
        <button onClick={() => alert('Map Location')} style={{ padding: '5px 10px' }}>Map Location - Pick up now</button>
      </div>

      {/* Filters */}
      <div className="filters" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '10px 20px', background: '#ffb4b4' }}>
        {[
          { img: 'Images/Ultraprocessed foods display 2 framed - shutterstock_2137640529_r.jpg', label: 'Fast Food' },
          { img: 'Images/CR7 Veg .jpg', label: 'Healthy' },
          { img: 'Images/CR7.jpg', label: 'Burgers' },
          { img: 'Images/CR7 SUCCI.jpg', label: 'Chinese' },
          { img: 'Images/CR7 WINGS.jpg', label: 'Wings' },
          { img: 'Images/CR7 PIZZA.webp', label: 'Pizza' },
          { img: 'Images/CR7 SUCCI .webp', label: 'Halal' },
          { img: 'Images/CR7 KOREA .jpeg', label: 'Korean' },
        ].map((filter, idx) => (
          <button key={idx} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '5px', padding: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={filter.img} alt={filter.label} style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '4px', marginBottom: '5px' }} />
            <span>{filter.label}</span>
          </button>
        ))}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '5px', padding: '5px' }}>&rarr;</button>
      </div>

      {/* Restaurant List */}
      <div className="restaurant-list" style={{ padding: '10px 20px', maxHeight: '70vh', overflowY: 'auto' }}>
        {restaurantList.map((rest, idx) => (
          <div key={idx} style={{ display: 'flex', background: '#fff', marginBottom: '10px', padding: '10px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer', position: 'relative', alignItems: 'center' }} onClick={() => handleShowMenu(rest.name)}>
            <img src={rest.image} alt={rest.name} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }} />
            <div style={{ flex: 1 }}>
              <div>{rest.name}</div>
              <div style={{ color: '#666', fontWeight: 'bold' }}>{rest.rating} ★</div>
              {rest.promo ? <div style={{ color: 'red', fontWeight: 'bold' }}>{rest.promo}</div> : null}
              <div>{rest.time} - {rest.distance}</div>
            </div>
            <button style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); /* toggle favorite */ }}>♥</button>
          </div>
        ))}
      </div>

      {/* Modal for Restaurant Menu */}
      {showModal === 'menu' && (
        <div className="modal" style={{ position: 'fixed', zIndex: 999, left: 0, top: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-content" style={{ background: '#fff', margin: '50px auto', padding: '20px', borderRadius: '10px', maxWidth: '600px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold' }} onClick={closeModal}>&times;</span>
            {currentRestaurant && (
              <>
                <img src={getRestaurantImage(currentRestaurant)} alt={currentRestaurant} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }} />
                <h2>{currentRestaurant} Menu</h2>
                <div>
                  {(restaurantMenus[currentRestaurant] || []).map((item, idx) => (
                    <div key={idx} style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => { setPendingFoodItem(item); setFoodQuantity(1); openModal('foodOpinion'); }}>
                      <strong>{item.name}</strong> - {item.price}
                    </div>
                  ))}
                </div>
                <button style={{ marginTop: '10px' }} onClick={() => { alert('Map location'); }}>View Map Location</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Food Opinion Modal */}
      {showModal === 'foodOpinion' && (
        <div className="modal" style={{ position: 'fixed', zIndex: 1000, left: 0, top: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-content" style={{ background: '#fff', margin: '50px auto', padding: '20px', borderRadius: '10px', maxWidth: '400px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold' }} onClick={closeModal}>&times;</span>
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
              <button onClick={handleAddFoodWithOpinion}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Food Modal for adding items */}
      {showModal === 'food' && (
        <div className="food-modal" style={{ position: 'fixed', zIndex: 1001, left: 0, top: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)' }}>
          <div className="food-modal-content" style={{ background: '#fff', margin: '50px auto', padding: '20px', borderRadius: '10px', maxWidth: '400px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold' }} onClick={closeModal}>&times;</span>
            <h3>{pendingFoodItem?.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '10px' }}>
              <button onClick={() => setFoodQuantity((q) => Math.max(1, q - 1))}>-</button>
              <span>{foodQuantity}</span>
              <button onClick={() => setFoodQuantity((q) => q + 1)}>+</button>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => { handleAddFood(pendingFoodItem); closeModal(); }}>Add to Order</button>
              <button onClick={closeModal} style={{ marginLeft: '10px' }}>Exit</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary component */}
      <OrderSummary
        orderItems={orderItems}
        total={total}
        removeItem={removeItem}
        handleCheckout={handleCheckout}
        handleOrderHistory={handleViewOrderHistory}
        handleVoucher={() => openModal('voucher')}
      />

      {/* Checkout Page */}
      {showCheckout && (
        <div style={{ padding: '20px', background: '#fff', maxWidth: '600px', margin: 'auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', marginTop: '20px' }}>
          <h2>Checkout</h2>
          <h3>Order Summary</h3>
          <ul>
            {orderItems.map((item, idx) => (
              <li key={idx}>{item.name} x{item.quantity} @ {item.price}
                {item.opinion && item.opinion !== 'No preference' ? <div>Opinion: {item.opinion}</div> : null}
              </li>
            ))}
          </ul>
          <h3>Total: R{total.toFixed(2)}</h3>
          <h3>Payment Method</h3>
          <div style={{ marginBottom: '20px' }}>
            <input type="radio" id="eft" name="payment" value="EFT" defaultChecked />
            <label htmlFor="eft">EFT Bank Transfer</label>
          </div>
          <button style={{ padding: '10px 20px', background: '#f90404', color: '#fff', border: 'none', borderRadius: '5px', marginRight: '10px' }} onClick={confirmEFT}>Confirm EFT Payment</button>
          <button style={{ padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '5px' }} onClick={() => setShowCheckout(false)}>Cancel</button>
        </div>
      )}

      {/* Order History Modal */}
      {showOrderHistory && (
        <div className="modal" style={{ position: 'fixed', zIndex: 999, left: 0, top: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
          <div className="modal-content" style={{ background: '#fff', maxHeight: '80vh', margin: '50px auto', padding: '20px', borderRadius: '10px', maxWidth: '600px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setShowOrderHistory(false)}>&times;</span>
            <h2>Order History</h2>
            {orderHistory.length === 0 ? (
              <p>No history</p>
            ) : (
              orderHistory.map((order, idx) => (
                <div key={idx} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                  <strong>Restaurant:</strong> {order.restaurant}<br />
                  <strong>Date:</strong> {new Date(order.date).toLocaleString()}<br />
                  <img src={getRestaurantImage(order.restaurant)} alt={order.restaurant} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  <button style={{ marginTop: '10px', background: '#007bff', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => {
                    alert(order.items.map(it => `${it.name} x${it.quantity} @ ${it.price}${it.opinion ? `, Opinion: ${it.opinion}` : ''}`).join('\n'));
                  }}>View</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {showModal === 'voucher' && (
        <div className="modal" style={{ position: 'fixed', zIndex: 1000, left: 0, top: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-content" style={{ background: '#fff', margin: '50px auto', padding: '20px', borderRadius: '10px', maxWidth: '400px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => closeModal() }>&times;</span>
            <h3>Enter Voucher Code</h3>
            <input
              type="text"
              placeholder="Voucher Code"
              style={{ width: '100%', padding: '8px' }}
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
            />
            <button style={{ marginTop: '10px', width: '100%', background: '#ff0202', color: '#fff', padding: '8px', border: 'none', borderRadius: '5px' }} onClick={handleVoucherInput}>Apply</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;