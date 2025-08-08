import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY; // Make sure to set this in your env
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [address, setAddress] = useState('Loading address...');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [activeButton, setActiveButton] = useState('');

  useEffect(() => {
    // Fetch address from Supabase
    const fetchAddress = async () => {
      const { data, error } = await supabase
        .from('search_location')
        .select('address')
        .limit(1)
        .single();

      if (error || !data) {
        setAddress('Address not found');
      } else {
        setAddress(data.address);
      }
    };
    fetchAddress();
  }, []);

  const handleProfileClick = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    // Scroll to sections based on button
    if (buttonName === 'Favourites') {
      document.getElementById('favouritesSection').scrollIntoView({ behavior: 'smooth' });
    } else if (buttonName === 'Nearby') {
      document.getElementById('nearbySection').scrollIntoView({ behavior: 'smooth' });
    } else if (buttonName === 'Another') {
      document.getElementById('anotherSection').scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="top-left">
          <span className="deliver-now">Deliver Now</span>
          <div className="address">{address}</div>
        </div>
        <div className="top-right">
          <div className="user-profile" onClick={handleProfileClick} style={{ position: 'relative', cursor: 'pointer' }}>
            <img src="profile_icon.png" alt="User Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            {showProfilePopup && (
              <div className="popup" style={{
                position: 'absolute', top: '50px', right: 0, background: '#fff', border: '1px solid #ccc', padding: '10px', zIndex: 10
              }}>
                User Profile Details
              </div>
            )}
          </div>
          <div className="halaal-icon">
            <img src="halaal_icon.png" alt="Halaal Icon" style={{ width: '30px', height: '30px' }} />
          </div>
        </div>
      </header>

      {/* Search and Sort */}
      <section className="search-section" style={{ display: 'flex', padding: '10px 20px', alignItems: 'center', gap: '10px' }}>
        <input type="text" placeholder="Search..." style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }} />
        <button id="sortButton" title="Sort" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="sort_icon.png" alt="Sort" />
        </button>
      </section>

      {/* Categories */}
      <section className="categories" style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
        {[
          { id: 'favourites', label: 'Favourites', img: 'favourite.png' },
          { id: 'gatsby', label: 'Gatsby', img: 'gatsby.png' },
          { id: 'gourmet', label: 'Gourmet', img: 'gourmet.png' },
          { id: 'more', label: 'More', img: 'chip_roll.png' },
        ].map(cat => (
          <div key={cat.id} className="category" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleButtonClick(cat.label)}>
            <img src={cat.img} alt={cat.label} style={{ width: '50px', height: '50px' }} />
            <div className="category-label" style={{ color: 'grey', marginTop: '5px' }}>{cat.label}</div>
          </div>
        ))}
      </section>

      {/* Action Buttons */}
      <section className="action-buttons" style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0', marginTop: '10px' }}>
        <button
          className="filter-btn"
          style={{
            border: '1px solid red',
            color: activeButton === 'Filters' ? '#fff' : 'black',
            backgroundColor: activeButton === 'Filters' ? 'red' : 'transparent',
            padding: '8px 12px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
          onClick={() => handleButtonClick('Filters')}
        >
          <img src="filter_icon.png" alt="Filter" style={{ width: '20px', height: '20px' }} />
          Filters
        </button>
        <button
          style={{
            border: '1px solid red',
            color: activeButton === 'Nearby' ? '#fff' : 'black',
            backgroundColor: activeButton === 'Nearby' ? 'red' : 'transparent',
            padding: '8px 12px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
          onClick={() => handleButtonClick('Nearby')}
        >
          <img src="nearby_icon.png" alt="Nearby" style={{ width: '20px', height: '20px' }} />
          Nearby
        </button>
        <button
          style={{
            border: '1px solid red',
            color: activeButton === 'Halaal' ? '#fff' : 'black',
            backgroundColor: activeButton === 'Halaal' ? 'red' : 'transparent',
            padding: '8px 12px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
          onClick={() => handleButtonClick('Halaal')}
        >
          <img src="nearby_icon.png" alt="Halaal" style={{ width: '20px', height: '20px' }} />
          Halaal
        </button>
        <button
          style={{
            border: '1px solid red',
            color: activeButton === 'Checkout' ? '#fff' : 'black',
            backgroundColor: activeButton === 'Checkout' ? 'red' : 'transparent',
            padding: '8px 12px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
          onClick={() => handleButtonClick('Checkout')}
        >
          <img src="nearby_icon.png" alt="Checkout" style={{ width: '20px', height: '20px' }} />
          Checkout
        </button>
      </section>

      {/* Order Options */}
      <section className="order-options" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        {['order1.png', 'order2.png', 'order3.png'].map((imgSrc, index) => (
          <div
            key={index}
            className="order-card"
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => alert(`Order ${index + 1} clicked!`)}
          >
            <img src={imgSrc} alt={`Order ${index + 1}`} style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '0 0 8px 8px'
              }}
            >
              Order
            </div>
          </div>
        ))}
      </section>

      {/* Content Sections */}
      <section id="favouritesSection" style={{ padding: '20px', borderTop: '1px solid #ccc' }}>
        <h2>Favourites</h2>
        {/* Content dynamically loaded */}
      </section>
      <section id="nearbySection" style={{ padding: '20px', borderTop: '1px solid #ccc' }}>
        <h2>Nearby</h2>
        {/* Content dynamically loaded */}
      </section>
      <section id="anotherSection" style={{ padding: '20px', borderTop: '1px solid #ccc' }}>
        <h2>Another Section</h2>
        {/* Content */}
      </section>
    </div>
  );
}

export default App;