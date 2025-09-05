import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { loadStripe } from '@stripe/stripe-js';


function App() {
  // State variables
  const [showModal, setShowModal] = useState({
    otp: false,
    login: false,
    forgotPassword: false,
  });
  const [driverRegistered, setDriverRegistered] = useState(false);
  const [driverApproved, setDriverApproved] = useState(false);
  const [driverData, setDriverData] = useState({});
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [page, setPage] = useState(''); // 'login', 'register', 'orderView', 'driverAccount', 'waiting'

  // Toggle modal helpers
  const openModal = (name) => setShowModal((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name) => setShowModal((prev) => ({ ...prev, [name]: false }));

  // Menu toggle
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // On initial load
  useEffect(() => {
    if (!driverRegistered) {
      loadLoginPage();
    } else {
      loadLoginPage();
    }
  }, []);

  // Load pages
  const loadLoginPage = () => {
    setPage('login');
  };

  const loadRegisterPage = () => {
    setPage('register');
  };

  const loadOrderView = () => {
    if (!driverRegistered || !driverApproved) {
      alert('You are not approved yet or not registered.');
      loadLoginPage();
      return;
    }
    setPage('orderView');
  };

  const loadDriverAccount = () => {
    if (!driverRegistered) {
      alert('Please register first.');
      loadRegisterPage();
      return;
    }
    setPage('driverAccount');
  };

  // Registration flow
  const handleRegister = (e) => {
    e.preventDefault();
    // For demo, just set driver data
    setDriverData({
      name: e.target.name.value,
      email: e.target.email.value,
      idNumber: e.target.idNumber.value,
      phoneNumber: e.target.phoneNumber.value,
      bankDetails: e.target.bankDetails.value,
      bankName: e.target.bankName.value,
      otherBank: e.target.otherBank?.value || '',
      carColor: e.target.carColor.value,
      carType: e.target.carType.value,
      carRegNumber: e.target.carRegNumber.value,
    });
    setDriverRegistered(true);
    generateOtp();
    showOtpModal();
  };

  const generateOtp = () => {
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);
    alert(`OTP sent to Phone: ${driverData.phoneNumber} and Email: ${driverData.email}. (OTP: ${otpCode})`);
  };

  const showOtpModal = () => setShowModal({ otp: true });
  const hideOtpModal = () => setShowModal({ otp: false });

  const handleOtpVerify = () => {
    if (otp.trim() === generatedOtp) {
      alert('OTP verified! Awaiting admin approval...');
      hideOtpModal();
      simulateAdminApproval();
    } else {
      alert('Incorrect OTP. Please try again.');
    }
  };

  const simulateAdminApproval = () => {
    setWaitingApproval(true);
    setTimeout(() => {
      setDriverApproved(true);
      setWaitingApproval(false);
      alert('Admin approved your registration! You can now access order view.');
    }, 3000);
  };

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim().toLowerCase();
    const password = e.target.password.value.trim();
    if (driverData.email && email === driverData.email.toLowerCase()) {
      // Save credentials
      localStorage.setItem('driverEmail', email);
      localStorage.setItem('driverPassword', password);
      if (driverApproved) {
        loadOrderView();
      } else {
        alert('Waiting for admin approval...');
        simulateAdminApproval();
        setWaitingApproval(true);
      }
      closeModal('login');
    } else {
      alert('Invalid email.');
    }
  };

  // Render different pages
  const renderPage = () => {
    if (page === 'login') {
      return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>Driver Login</h1>
          <button className="action-btn" onClick={() => openModal('login')}>Login</button>
        </div>
      );
    } else if (page === 'register') {
      return (
        <div style={{ maxWidth: '600px', margin: '20px auto' }}>
          <h1>Register as a Driver</h1>
          <form onSubmit={handleRegister}>
            <label>Selfie (Driver Photo):</label>
            <input type="file" accept="image/*" required /><br />

            <label>Name:</label>
            <input type="text" name="name" required /><br />

            <label>Email:</label>
            <input type="email" name="email" required /><br />

            <label>Phone Number:</label>
            <input type="tel" name="phoneNumber" placeholder="e.g., 0612345678" required /><br />

            <label>ID Number:</label>
            <input type="text" name="idNumber" required /><br />

            <label>Bank Account Details:</label>
            <input type="text" name="bankDetails" required /><br />

            <label>Bank Name:</label>
            <select name="bankName" required>
              <option value="">Select Bank</option>
              <option value="FNB">FNB</option>
              <option value="Standard Bank">Standard Bank</option>
              <option value="Capitec">Capitec</option>
              <option value="NedBank">NedBank</option>
              <option value="Other">Other</option>
            </select><br />

            <div className={document.querySelector('select[name="bankName"]')?.value==='Other' ? '' : 'hidden'}>
              <label>Specify Bank:</label>
              <input type="text" name="otherBank" /><br />
            </div>

            <label>Driver's License Upload:</label>
            <input type="file" accept="image/*" required /><br />

            <label>Car Color:</label>
            <input type="text" name="carColor" required /><br />

            <label>Car Type:</label>
            <input type="text" name="carType" required /><br />

            <label>Car Photo:</label>
            <input type="file" accept="image/*" required /><br />

            <label>Car Registration Number:</label>
            <input type="text" name="carRegNumber" required /><br />

            <button type="submit" className="action-btn">Submit Registration</button>
          </form>
        </div>
      );
    } else if (page === 'orderView') {
      return (
        <div style={{ padding: '20px' }}>
          <h1>Order Details</h1>
          <div className="order-details">
            <p><strong>Order ID:</strong> #12345</p>
            <p><strong>Customer Name:</strong> John Doe</p>
            <p><strong>Order Date:</strong> August 15, 2025</p>
            <p><strong>Status:</strong> Processing</p>
            <p><strong>Order within your area:</strong> Yes (simulated GPS location)</p>
            <p><strong>Order Address:</strong> 123 Main St, Cape Town</p>
            <p><strong>Total Amount:</strong> R99.99</p>
          </div>
          {/* Could list items here */}
          <button onClick={() => setPage('')}>Back</button>
        </div>
      );
    } else if (page === 'driverAccount') {
      return (
        <div style={{ maxWidth: '600px', margin: '20px auto' }}>
          <h1>Driver Profile</h1>
          <form>
            <label>Selfie:</label>
            <input type="file" accept="image/*" /><br />
            <p>Name: {driverData.name}</p>
            <p>Email: {driverData.email}</p>
            <p>ID Number: {driverData.idNumber}</p>
            <p>Bank Details: {driverData.bankDetails}</p>
            <p>Bank Name: {driverData.bankName}</p>
            <p>Car Color: {driverData.carColor}</p>
            <p>Car Type: {driverData.carType}</p>
            <p>Car Reg: {driverData.carRegNumber}</p>
            <button type="button" onClick={() => alert('Profile saved and sent to admin.')}>Save</button>
            <button type="button" onClick={() => {
              if (window.confirm('Are you sure you want to terminate?')) {
                alert('Termination request sent to admin.');
                setDriverRegistered(false);
                setDriverApproved(false);
                setDriverData({});
                loadRegisterPage();
              }
            }} style={{ backgroundColor: 'red', marginLeft: '10px' }}>Terminate Driver</button>
            <br /><br />
            <button onClick={() => setPage('')}>Back</button>
          </form>
        </div>
      );
    } else if (page === 'waiting') {
      return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Waiting for admin approval...</h2>
        </div>
      );
    }
  };

  return (
    <div>
      {/* Header with menu toggle */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="driver-label" style={{ fontWeight: 'bold', color: 'red', fontSize: '20px' }}>Driver</div>
        <div className="menu-container" style={{ position: 'relative' }}>
          <button className="menu-button" onClick={toggleMenu}>Menu ▼</button>
          {menuOpen && (
            <div className="dropdown-content" style={{
              position: 'absolute', right: 0, top: '100%', background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)', minWidth: '200px', borderRadius: '4px'
            }}>
              <a href="#" onClick={() => { loadOrderView(); setMenuOpen(false); }}>Order View</a>
              <a href="#" onClick={() => { loadRegisterPage(); setMenuOpen(false); }}>New Driver</a>
              <a href="#" onClick={() => { loadDriverAccount(); setMenuOpen(false); }}>Driver View Account</a>
              <a href="#" onClick={() => {
                if (driverData.email) localStorage.setItem('driverEmail', driverData.email);
                if (driverData.password) localStorage.setItem('driverPassword', driverData.password);
                setDriverRegistered(false);
                setDriverApproved(false);
                setDriverData({});
                setPage('login');
                setMenuOpen(false);
              }}>Logout</a>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {renderPage()}

      {/* OTP Modal */}
      {showModal.otp && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <h3>Enter OTP</h3>
            <p>We've sent a 4-digit OTP to your email and phone.</p>
            <input
              type="text"
              maxLength={4}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleOtpVerify}>Verify</button>
              <button onClick={showOtpModal} style={{ marginLeft: '10px' }}>Resend OTP</button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showModal.login && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <h3>Login</h3>
            <form onSubmit={handleLogin}>
              <input type="email" id="loginEmail" placeholder="Email" required />
              <input type="password" id="loginPassword" placeholder="Password" required />
              <button type="submit">Login</button>
            </form>
            <p style={{ marginTop: '10px' }}><a href="#" onClick={() => { hideModal('login'); loadRegisterPage(); }}>Register</a></p>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showModal.forgotPassword && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <h3>Reset Password</h3>
            <input
              type="email"
              id="forgotEmail"
              placeholder="Your email"
            />
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => {
                  const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
                  if (driverData.email && email === driverData.email.toLowerCase()) {
                    alert('Password reset link sent to your email (simulated).');
                  } else {
                    alert('Email not found.');
                  }
                  hideModal('forgotPassword');
                }}
              >
                Send Reset Link
              </button>
              <button style={{ marginLeft: '10px' }} onClick={() => hideModal('forgotPassword')}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
const stripePromise = loadStripe('your_public_stripe_key');

const handleCheckout = async () => {
  const stripe = await stripePromise;
  // Call your backend to create a checkout session
  const response = await fetch('/create-checkout-session', {
    method: 'POST',
  });
  const session = await response.json();
  // Redirect to checkout
  await stripe.redirectToCheckout({ sessionId: session.id });
};
export default App;