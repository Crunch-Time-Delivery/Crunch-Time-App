import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useState, useEffect } from 'react';
import './database.jsx'; // your real-time notifications
import  './mapAPI.jsx'; // map display
import  './PayfastAPI.jsx'; // payment process
import './smsAndEmailAPI.jsx'; // SMS & email
import  './supabaseClient.js';
import './createPayFastPayment.js';



function App() {
  // State management
  const [showModal, setShowModal] = useState({
    register: false,
    otp: false,
    login: false,
    itemForm: false,
    userForm: false,
    paymentForm: false,
  });
  const [currentPage, setCurrentPage] = useState('register'); // or 'dashboard'
  const [vendorData, setVendorData] = useState({});
  const [otpCode, setOtpCode] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [adminApproved, setAdminApproved] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Management data
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);

  // Current form states
  const [editIndex, setEditIndex] = useState(-1);
  const [currentType, setCurrentType] = useState(''); // 'items', 'orders', 'users', 'payment'

  // Utility functions
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const openModal = (name) => setShowModal(prev => ({ ...prev, [name]: true }));
  const closeModal = (name) => setShowModal(prev => ({ ...prev, [name]: false }));

  // Initialization
  useEffect(() => {
    // Show registration modal first
    showRegistration();
  }, []);

  const showRegistration = () => {
    setCurrentPage('register');
    // Reset data
    setVendorData({});
  };

  const startRegistration = () => {
    // Save data
    const email = document.getElementById('regEmail').value.trim();
    const name = document.getElementById('regName').value.trim();
    const pass = document.getElementById('regPassword').value.trim();
    if (!email || !name || !pass) { alert('Fill all fields'); return; }
    setVendorData({ email, name, pass });
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOTP(otp);
    alert(`OTP sent: ${otp}`);
    setShowModal({ register: false, otp: true });
  };

  const verifyOTP = () => {
    const inputOtp = document.getElementById('otpInput').value.trim();
    if (inputOtp === generatedOTP) {
      alert('OTP verified! Registration complete.');
      localStorage.setItem('vendorEmail', vendorData.email);
      localStorage.setItem('vendorPass', vendorData.pass);
      setAdminApproved(false);
      setWaitingApproval(true);
      setShowModal({ otp: false });
      simulateAdminApproval();
    } else {
      alert('Incorrect OTP');
    }
  };

  const simulateAdminApproval = () => {
    setTimeout(() => {
      setAdminApproved(true);
      setWaitingApproval(false);
      alert('Admin approved your registration! You can now access dashboard.');
      setCurrentPage('dashboard');
    }, 3000);
  };

  const showLogin = () => {
    setCurrentPage('login');
  };

  const handleLogin = () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const storedEmail = localStorage.getItem('vendorEmail');
    const storedPass = localStorage.getItem('vendorPass');
    if (username === storedEmail && password === storedPass) {
      if (!adminApproved) {
        alert('Waiting for admin approval...');
        setWaitingApproval(true);
        simulateAdminApproval();
      } else {
        setCurrentPage('dashboard');
      }
    } else {
      alert('Invalid credentials');
    }
  };

  // Management section display
  const showManagement = (type) => {
    setCurrentType(type);
  };

  // CRUD operations for items
  const handleAddItem = () => {
    setEditIndex(-1);
    // Show item form modal
    document.getElementById('itemVendor').value='';
    document.getElementById('itemName').value='';
    document.getElementById('itemPrice').value='';
    document.getElementById('itemStock').value='In Stock';
    setShowModal({ itemForm:true });
  };
  const handleEditItem = (i) => {
    setEditIndex(i);
    const item = items[i];
    document.getElementById('itemVendor').value= item.vendor;
    document.getElementById('itemName').value= item.item;
    document.getElementById('itemPrice').value= item.price;
    document.getElementById('itemStock').value= item.stock;
    setShowModal({ itemForm:true });
  };
  const saveItem = () => {
    const vendor = document.getElementById('itemVendor').value.trim();
    const itemName = document.getElementById('itemName').value.trim();
    const price = parseFloat(document.getElementById('itemPrice').value);
    const stock = document.getElementById('itemStock').value;
    if (!vendor || !itemName || isNaN(price)) { alert('Fill all fields'); return; }
    const newItem = { vendor, item: itemName, price, stock };
    if (editIndex >=0) {
      items[editIndex]= newItem;
      setItems([...items]);
    } else {
      setItems(prev => [...prev, newItem]);
    }
    closeModal('itemForm');
  };

  // Similar functions for Orders, Users, Payments...
  // For brevity, only items are shown here. You can implement similarly.

  // Logout
  const logout = () => {
    localStorage.clear();
    setCurrentPage('register');
  };

  // Render functions
  const renderDashboard = () => {
    if (waitingApproval) {
      return <h2 style={{ textAlign:'center', marginTop:'50px' }}>Waiting for admin approval...</h2>;
    }
    return (
      <div style={{ padding:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div className="vendor-text">Vendor</div>
          <div style={{ position:'relative' }}>
            <button className="profile-btn" onClick={toggleDropdown}><i className="fas fa-user-circle"></i> Menu</button>
            <div className={`dropdown ${dropdownOpen?'show':''}`} style={{
              position:'absolute', right:'0', top:'100%', background:'#fff', border:'1px solid #ddd', borderRadius:'8px', boxShadow:'0 4px 8px rgba(0,0,0,0.2)', minWidth:'200px', zIndex: '1000'
            }}>
              <a href="#" onClick={()=>{showManagement('items'); setDropdownOpen(false);}}>Manage Items</a>
              <a href="#" onClick={()=>{showManagement('orders'); setDropdownOpen(false);}}>Manage Orders</a>
              <a href="#" onClick={()=>{showManagement('users'); setDropdownOpen(false);}}>Manage Users</a>
              <a href="#" onClick={()=>{showManagement('payment'); setDropdownOpen(false);}}>Manage Payments</a>
              <a href="#" onClick={() => { logout(); setDropdownOpen(false); }}>Logout</a>
            </div>
          </div>
        </div>
        {/* Management Sections */}
        {currentType==='items' && (
          <div>
            <h3>Items</h3>
            <button onClick={handleAddItem}>Add Item</button>
            {/* Items table */}
            {items.length===0 ? <p>No items</p> : (
              <table>
                <thead><tr><th>Vendor</th><th>Item</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {items.map((it,i)=>(
                    <tr key={i}>
                      <td>{it.vendor}</td>
                      <td>{it.item}</td>
                      <td>R {it.price.toFixed(2)}</td>
                      <td>{it.stock}</td>
                      <td>
                        <button onClick={()=>editItem(i)}>Edit</button>
                        <button style={{ background:'#f44336', marginLeft:'5px' }} onClick={()=>{items.splice(i,1); setItems([...items]);}}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {/* Similarly render for orders, users, payments */}
        {/* ... */}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="vendor-text">Vendor</div>
        {/* Menu button handled above */}
      </div>
      {/* Render page content */}
      {currentPage==='register' && (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'80vh' }}>
          <button onClick={() => showModal('register')} style={{ padding:'20px', fontSize:'20px' }}>Register New Vendor</button>
        </div>
      )}
      {currentPage==='login' && (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'80vh' }}>
          <button onClick={() => showModal('login')} style={{ padding:'20px', fontSize:'20px' }}>Login</button>
        </div>
      )}
      {currentPage==='dashboard' && renderDashboard()}

      {/* Modals */}
      {showModal.register && (
        <div className="modal" style={{ display:'flex' }}>
          <div className="modal-box">
            <h3>Register New Vendor</h3>
            <input type="email" id="regEmail" placeholder="Invitation Email" />
            <input type="text" id="regName" placeholder="Full Name" />
            <input type="password" id="regPassword" placeholder="Password" />
            <button style={{ width:'100%', background:'#fa0202', color:'#fff' }} onClick={startRegistration}>Create Account</button>
          </div>
        </div>
      )}
      {showModal.otp && (
        <div className="modal" style={{ display:'flex' }}>
          <div className="modal-box">
            <h3>Enter OTP</h3>
            <input id="otpInput" placeholder="OTP" />
            <button style={{ width:'100%', background:'#f80202', color:'#fff' }} onClick={verifyOTP}>Verify OTP</button>
          </div>
        </div>
      )}
      {showModal.login && (
        <div className="modal" style={{ display:'flex' }}>
          <div className="modal-box">
            <h3>Vendor Login</h3>
            <input id="username" placeholder="Username" />
            <input id="password" placeholder="Password" type="password" />
            <button style={{ width:'100%', background:'#f40101', color:'#fff' }} onClick={handleLogin}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;