import React, { useState, useEffect } from 'react';

function DriverLogin() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [driverData, setDriverData] = useState({});
  const [driverApproved, setDriverApproved] = useState(false);
  const [userType, setUserType] = useState(null);
  
  // Load driver data from local storage on mount
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('registeredUser')) || {};
    setDriverData(data);
  }, []);

  const showNotification = (message, type) => {
    // Implement your notification logic or use a library
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const sendSms = (toNumber, message) => {
    fetch('http://localhost:3000/send-sms', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ to: toNumber, message }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) showNotification('SMS sent successfully.', 'success');
      else showNotification('Failed to send SMS: ' + data.error, 'error');
    })
    .catch(() => showNotification('Error sending SMS.', 'error'));
  };

  const generateAndSendOtp = () => {
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);
    alert(`OTP sent to Email: ${driverData.email}. (OTP: ${otpCode})`);
    fetch('/send-otp', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ phoneNumber: driverData.contact, otp: otpCode }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) alert(`OTP sent to ${driverData.contact}`);
      else alert('Failed to send OTP.');
    })
    .catch(() => alert('Error sending OTP.'));
  };

  const handleLogin = () => {
    if (!userType) {
      alert('Please select Driver or Admin login.');
      return;
    }
    if (userType === 'driver') {
      if (driverData.email?.toLowerCase() === email.toLowerCase() && driverData.password === password) {
        localStorage.setItem('currentUser', JSON.stringify(driverData));
        if (driverApproved) {
          window.location.href = 'http://127.0.0.1:5501/driver-website/public/mainpage.html';
        } else {
          generateAndSendOtp();
          setShowOtpModal(true);
        }
      } else {
        alert('Invalid driver credentials.');
      }
    } else if (userType === 'admin') {
      const adminUsername = 'admin';
      const adminPassword = 'adminpass';
      if (email === adminUsername && password === adminPassword) {
        window.location.href='http://127.0.0.1:5501/driver-app/admin/admin_dashboard.html';
      } else {
        alert('Invalid admin credentials.');
      }
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      alert('OTP verified! Awaiting admin approval...');
      setShowOtpModal(false);
      if (driverApproved) {
        alert('Login successful! Accessing driver dashboard...');
        if (userType === 'driver') {
          window.location.href='http://127.0.0.1:5501/driver-website/public/mainpage.html';
        }
      }
    } else {
      alert('Incorrect OTP.');
    }
  };

  return (
    <div>
      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal" style={modalStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <img src="img/screenshot (251).jpg" alt="Welcome" style={{width: '250px', marginBottom: '20px'}} />
            <h2>Welcome</h2>
            <h3>Login</h3>
            <p>Welcome to CrunchTime halaal food delivery. Login to start ordering.</p>
            <label>Email Address</label>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password</label>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <a href="http://127.0.0.1:5501/vendor-website/public/Login/forgotpassword.html" target="_blank" rel="noopener noreferrer" id="loginForgotPassword">Forgot Password</a>
            <button style={loginButtonStyle} onClick={handleLogin}>Login</button>
            <div style={{marginTop: '10px'}}>
              <button style={driverBtnStyle} onClick={() => window.location.href='http://127.0.0.1:5501/driver-website/public/mainpage.html'}>Driver</button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal" style={modalStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <h3>Verify Account</h3>
            <p>Please enter the OTP number sent to your email to reset your password</p>
            <input type="text" maxLength={4} placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <div style={{marginTop: '10px'}}>
              <button onClick={verifyOtp}>Confirm</button>
              <button onClick={() => { generateAndSendOtp(); alert('OTP resent.'); }}>Resend OTP</button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger to show login modal */}
      <button onClick={() => setShowLoginModal(true)}>Open Login</button>
    </div>
  );
}

// Basic inline styles for modal
const modalStyle = {
  display: 'block',
  position: 'fixed',
  zIndex: 2000,
  left: 0, top: 0,
  width: '100%',
  height: '100%',
  overflow: 'auto',
  backgroundColor: 'rgba(0,0,0,0.4)',
};
const modalContentStyle = {
  backgroundColor: '#fff',
  margin: '15% auto',
  padding: '20px',
  borderRadius: '8px',
  width: '300px',
  textAlign: 'center',
};
const loginButtonStyle = {
  marginTop: '20px',
  backgroundColor: 'red',
  color: '#fff',
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  width: '100%',
};
const driverBtnStyle = {
  backgroundColor: 'red',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default DriverLogin;