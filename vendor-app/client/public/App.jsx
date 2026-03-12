import React, { useState } from 'react';
import ManagementSection from './ManagementSection';

function App() {
  const [activeSection, setActiveSection] = useState('items'); // items, orders, users, payment
  const [showOverlay, setShowOverlay] = useState(true);

  const handleShowSection = (section) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.clear();
    alert('Logged out');
    setShowOverlay(true);
  };

  const handleStart = () => {
    setShowOverlay(false);
  };

  return (
    <div>
      {/* Overlay for registration/login */}
      {showOverlay && (
        <div id="welcomeOverlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 9999,
          padding: '20px'
        }}>
          <img src="your-logo.png" alt="Logo" style={{ maxWidth: '250px', marginBottom: '20px' }} />
          <h2 style={{ color: 'gray' }}>Welcome to Vendor App</h2>
          <div className="centered-buttons">
            <button className="btn-create" onClick={handleStart}>Create Account</button>
            <button className="btn-login" onClick={() => { setShowOverlay(false); }}>Login</button>
            <button className="btn-browser" onClick={() => alert('Browse as guest')}>Browse</button>
            <div id="termsText">
              <p>Terms & Conditions</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="header" style={{ position: 'fixed', top: 0, width: '100%', height: '60px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 999 }}>
        <div className="vendor-text" style={{ fontWeight: 'bold', color: 'red', fontSize: '1.2em' }}>Vendor</div>
        <div className="menu-container" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <button className="profile-btn" id="profileBtn" onClick={() => {
            const dropdown = document.getElementById('profileDropdown');
            dropdown.classList.toggle('show');
          }} style={{ background: '#ff0000', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '50px' }}>
            <i className="fas fa-user-circle"></i> Menu
          </button>
          <div id="profileDropdown" className="dropdown" style={{ display: 'none', position: 'absolute', right: 0, top: '60px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', minWidth: '200px', zIndex: 1000 }}>
            <a href="#" onClick={() => handleShowSection('items')}>Manage Items</a>
            <a href="#" onClick={() => handleShowSection('orders')}>Manage Orders</a>
            <a href="#" onClick={() => handleShowSection('users')}>Manage Users</a>
            <a href="#" onClick={() => handleShowSection('payment')}>Manage Payments</a>
            <a href="#" onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ marginTop: '80px', padding: '20px', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        {/* Management Buttons */}
        <div className="management-buttons" style={{ marginBottom: '10px' }}>
          <button style={{ background: '#f90101', color: '#fff', padding: '8px 12px', marginRight: '5px', border: 'none', borderRadius: '4px' }} onClick={() => handleShowSection('items')}>Manage Items</button>
          <button style={{ background: '#f90101', color: '#fff', padding: '8px 12px', marginRight: '5px', border: 'none', borderRadius: '4px' }} onClick={() => handleShowSection('orders')}>Manage Orders</button>
          <button style={{ background: '#f90101', color: '#fff', padding: '8px 12px', marginRight: '5px', border: 'none', borderRadius: '4px' }} onClick={() => handleShowSection('users')}>Manage Users</button>
          <button style={{ background: '#f90101', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '4px' }} onClick={() => handleShowSection('payment')}>Manage Payments</button>
        </div>

        {/* Sections */}
        {activeSection === 'items' && (
          <ManagementSection type="items" />
        )}
        {activeSection === 'orders' && (
          <ManagementSection type="orders" />
        )}
        {activeSection === 'users' && (
          <ManagementSection type="users" />
        )}
        {activeSection === 'payment' && (
          <ManagementSection type="payment" />
        )}
      </div>
    </div>
  );
}

export default App;