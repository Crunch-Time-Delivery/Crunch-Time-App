import React, { useState, useEffect } from 'react';

function VendorLogin() {
  const [showLogin, setShowLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [currentOTP, setCurrentOTP] = useState('');
  const [userData, setUserData] = useState({});
  
  useEffect(() => {
    // Load users or driverData from local storage or API
    const users = JSON.parse(localStorage.getItem('users')) || [];
    setUserData(users);
    // Generate OTP initially
    generateOTP();
  }, []);

const sendSms = async (toNumber, message) => {
  try {
    const response = await fetch('http://localhost:3000/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: toNumber, message }),
    });
    const data = await response.json();
    if (data.success) {
      showNotification('SMS sent successfully.', 'success');
    } else {
      showNotification('Failed to send SMS: ' + (data.error || 'Unknown error'), 'error');
    }
  } catch {
    showNotification('Error sending SMS.', 'error');
  }
};

// Example notification function
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.innerText = message;
  notification.className = `notification ${type}`;
  document.body.appendChild(notification);
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setCurrentOTP(otp);
    console.log('Generated OTP:', otp); // For demo
    // Send OTP via backend
    fetch('/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: userData.contact, otp }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) alert(`OTP sent to ${userData.contact}`);
      else alert('Failed to send OTP.');
    })
    .catch(() => alert('Error sending OTP.'));
  };

  const handleLogin = () => {
    const user = userData.find(u => u.email === username && u.pass === password);
    if (user) {
      localStorage.setItem('vendorLoggedIn', 'true');
      generateOTP();
      setShowOtp(true);
    } else {
      alert('Invalid credentials.');
    }
  };

  const verifyOTP = () => {
    if (otpInput.trim() === currentOTP) {
      alert('OTP verified! Redirecting...');
      setShowOtp(false);
      // Redirect to vendor page
      window.location.href = 'http://127.0.0.1:5501/vendor-website/public/mainpage.html';
    } else {
      alert('Incorrect OTP.');
    }
  };

  return (
    <div>
      {/* Login Modal */}
      {showLogin && (
        <div style={modalStyle} onClick={(e) => { if(e.target===e.currentTarget) setShowLogin(false); }}>
          <div style={modalContentStyle}>
            <img src="img/screenshot (253).jpg" alt="Welcome" style={{ width: 250, marginBottom: 20 }} />
            <h3>Welcome</h3>
            <p>For vendors Manage your orders in real time.</p>
            <label>Email Address</label>
            <input
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Password</label>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a
              href="http://127.0.0.1:5501/vendor-website/public/Login/forgotpassword.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', margin: '10px auto', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            >
              Forgot Password
            </a>
            <button style={loginBtnStyle} onClick={handleLogin}>Login</button>
            <p>Don't have an account? Register here</p>
            <button style={{...redirectBtnStyle, marginTop: 10}} onClick={() => window.location.href='http://127.0.0.1:5501/vendor-website/public/mainpage.html'}>Vendor</button>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtp && (
        <div style={modalStyle} onClick={(e) => { if(e.target===e.currentTarget) setShowOtp(false); }}>
          <div style={modalContentStyle}>
            <h3>Verify Account</h3>
            <p>Please enter the OTP sent to your email to verify your account</p>
            <input
              placeholder="OTP"
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
            />
            <button style={{ ...buttonStyle, backgroundColor:'#f80202' }} onClick={verifyOTP}>Confirm</button>
            <button style={buttonStyle} onClick={() => { generateOTP(); alert('OTP resent.'); }}>Resend OTP</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const modalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: 0, left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 999,
};
const modalContentStyle = {
  background: '#fff',
  padding: 20,
  borderRadius: 8,
  maxWidth: 350,
  width: '90%',
  textAlign: 'center',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
};
const buttonStyle = {
  width: '100%',
  padding: 10,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: 10,
};
const loginBtnStyle = {
  ...buttonStyle,
  backgroundColor: '#f40101',
  color: '#fff',
};
const redirectBtnStyle = {
  ...buttonStyle,
  backgroundColor: '#f80303',
  color: '#fff',
};

export default VendorLogin;