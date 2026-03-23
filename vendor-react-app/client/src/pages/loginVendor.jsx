import React, { useState } from 'react';

function VendorAuth() {
  const [showLogin, setShowLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Hardcoded credentials for testing
  const hardcodedEmail = 'vendor@example.com';
  const hardcodedPassword = 'password123';

  const handleLogin = () => {
    // Replace with your actual login/auth logic
    if (email === hardcodedEmail && password === hardcodedPassword) {
      // Simulate OTP send
      setNotification({ message: 'OTP sent to your email', type: 'success' });
      setShowLogin(false);
      setShowOTP(true);
    } else {
      setNotification({ message: 'Invalid credentials', type: 'error' });
    }
  };

  const verifyOTP = () => {
    // Replace with your OTP verification logic
    if (otp === '123456') {
      setNotification({ message: 'Login successful!', type: 'success' });
      // Redirect or fetch user data, roles etc.
    } else {
      setNotification({ message: 'Invalid OTP', type: 'error' });
    }
  };

  const handlePasswordRecovery = () => {
    // Placeholder for password recovery logic
    setNotification({ message: 'Password recovery link sent!', type: 'success' });
  };

  // Role-based access example (placeholder)
  const userRole = 'vendor'; // fetch this from your backend after login

  return (
    <div className="window-container">
      {/* Notification */}
      {notification.message && (
        <div
          className={`notification ${notification.type}`}
          style={{ position: 'fixed', top: 20, right: 20 }}
        >
          {notification.message}
        </div>
      )}

      {/* OTP Modal */}
      {showOTP && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-box">
            <img src="img/screenshot (253).jpg" alt="Welcome Image" />
            <h3>Verify Account</h3>
            <p>Please enter the OTP sent to your email to verify your account</p>
            <input
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              style={{ background: '#f80202', color: '#fff' }}
              onClick={verifyOTP}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-box">
            <img src="img/screenshot (253).jpg" alt="Welcome Image" />
            <h3>Welcome</h3>
            <p>For vendors, manage your orders in real time.</p>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a
              id="loginForgotPassword"
              href="#"
              onClick={handlePasswordRecovery}
            >
              Forgot Password
            </a>
            <button
              style={{ background: '#f40101', color: '#fff' }}
              onClick={handleLogin}
            >
              Login
            </button>
            <p>Don't have an account? Register here</p>
            <div id="bottomButtons">
              <button className="redirect-btn" id="vendorBtn" onClick={() => alert('Register flow here')}>
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role-based content example */}
      {userRole === 'vendor' && (
        <div>
          <h2>Vendor Dashboard</h2>
          {/* Your vendor-specific components */}
        </div>
      )}
    </div>
  );
}

export default VendorAuth;