import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey =  process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

import React, { useState } from 'react';

// Placeholder components for pages
function RegisterVendorPage() {
  return <div><h2>Register Vendor</h2><p>Form to register a new vendor</p></div>;
}

function ItemManage() {
  return <div><h2>Item Management</h2><p>Manage food items</p></div>;
}

function ManageOrder() {
  return <div><h2>Order Management</h2><p>View and manage orders</p></div>;
}

function PaymentManagement() {
  return <div><h2>Payment Management</h2><p>Handle payments and transactions</p></div>;
}

// Header with dropdown menu
function Header({ onNavigate }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleNavigation = (page) => {
    onNavigate(page);
    setShowMenu(false);
  };

  return (
    <div className="header">
      <h1>Admin Dashboard</h1>
      <div className="menu">
        <button onClick={toggleMenu} aria-label="Menu">
          <i className="fas fa-bars"></i>
        </button>
        {showMenu && (
          <div className="dropdown-content show">
            <a href="#" onClick={() => handleNavigation('registerVendor')}>New Register Vendor</a>
            <a href="#" onClick={() => handleNavigation('itemManage')}>Item Manage</a>
            <a href="#" onClick={() => handleNavigation('manageOrder')}>Manage Order</a>
            <a href="#" onClick={() => handleNavigation('paymentManagement')}>Payment Management</a>
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const [page, setPage] = useState('itemManage');

  const renderPage = () => {
    switch(page) {
      case 'registerVendor': return <RegisterVendor />;
      case 'itemManage': return <ItemManage />;
      case 'manageOrder': return <ManageOrder />;
      case 'paymentManagement': return <PaymentManagement />;
      default: return <ItemManage />;
    }
  }

  return (
    <div className="content">
      <Header onNavigate={setPage} />
      <div style={{ flex: 1, marginTop: '20px', overflow: 'auto' }}>
        {renderPage()}
      </div>
    </div>
  );
}

// Main render
ReactDOM.render(<Dashboard />, document.getElementById('root'));


export default RegisterVendorPage 