import React, { useState, useEffect } from 'react';

function UserLogin() {
  const [showLogin, setShowLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [driverData, setDriverData] = useState({});
  const [driverApproved, setDriverApproved] = useState(false);
  const [userType, setUserType] = useState(null); // 'user' or 'admin'

  // Load driver data
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('registeredUser')) || {};
    setDriverData(data);
  }, []);

  const sendSms = (toNumber, message) => {
    fetch('http://localhost:3000/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: toNumber, message }),
    })
    .then(res => res.json())
    .then(data => {
      showNotification(data.success ? 'SMS sent successfully.' : 'Failed to send SMS: ' + data.error, data.success ? 'success' : 'error');
    })
    .catch(() => {
      showNotification('Error sending SMS.', 'error');
    });
  };

  const generateAndSendOtp = () => {
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);
    alert(`OTP sent to Email: ${driverData.email}. (OTP: ${otpCode})`);
    // Send OTP via backend
    fetch('/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      alert('Please select User or Admin.');
      return;
    }
    if (userType === 'user') {
      if (driverData.email?.toLowerCase() === email.toLowerCase() && driverData.password === password) {
        localStorage.setItem('currentUser', JSON.stringify(driverData));
        if (driverApproved) {
          window.location.href = 'http://127.0.0.1:5501/user-website/public/mainpage.html';
        } else {
          generateAndSendOtp();
          setShowOtp(true);
        }
      } else {
        alert('Invalid credentials.');
      }
    } else if (userType === 'admin') {
      if (email === 'crunchtimeadmin' && password === 'crunchtimeadmin') {
        window.location.href='http://127.0.0.1:5501/driver-app/admin/admin_dashboard.html';
      } else {
        alert('Invalid admin credentials.');
      }
    }
    setUserType(null);
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      alert('OTP verified! Please wait for admin approval.');
      setShowOtp(false);
      if (driverApproved) {
        window.location.href='http://127.0.0.1:5501/user-website/public/mainpage.html';
      } else {
        alert('Your account is pending approval.');
      }
    } else {
      alert('Incorrect OTP.');
    }
  };

  const showNotification = (message, type) => {
    // Implement notification display
    alert(`${type.toUpperCase()}: ${message}`);
  };

  return (
    <>
      {/* Login Modal */}
      {showLogin && (
        <div style={modalStyle} onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}>
          <div style={modalContentStyle}>
            <img src="img/screenshot (251).jpg" alt="Welcome" style={{ width: 250, marginBottom: 20 }} />
            <h2>Welcome</h2>
            <h3>Login</h3>
            <p>Welcome to CrunchTime halaal food delivery. Login to start ordering.</p>
            <label>Email Address</label>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password</label>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <a href="http://127.0.0.1:5501/vendor-website/public/Login/forgotpassword.html" target="_blank" rel="noopener noreferrer" style={forgotStyle}>Forgot Password</a>
            <button style={loginButtonStyle} onClick={handleLogin}>Login</button>
            <div style={{ marginTop: 10 }}>
              <button style={redirectBtnStyle} onClick={() => { setUserType('user'); handleLogin(); }}>User</button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtp && (
        <div style={modalStyle} onClick={(e) => { if (e.target === e.currentTarget) setShowOtp(false); }}>
          <div style={modalContentStyle}>
            <h3>Verify Account</h3>
            <p>Please enter the OTP number sent to your email to reset your password</p>
            <input type="text" maxLength={4} placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <div style={{ marginTop: 10 }}>
              <button onClick={verifyOtp}>Confirm</button>
              <button onClick={() => { generateAndSendOtp(); alert('OTP resent.'); }}>Resend OTP</button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger button for demo, remove in real app */}
      {!showLogin && <button onClick={() => setShowLogin(true)}>Show Login</button>}
    </>
  );
}

// Styles (inline for simplicity)
const modalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  zIndex: 2000,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.4)',
};
const modalContentStyle = {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 8,
  width: 300,
  maxWidth: '90%',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  textAlign: 'center',
};
const loginButtonStyle = {
  marginTop: 20,
  backgroundColor: 'red',
  color: '#fff',
  padding: 10,
  border: 'none',
  borderRadius: 5,
  width: '100%',
  cursor: 'pointer',
};
const redirectBtnStyle = {
  backgroundColor: 'red',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 5,
  fontWeight: 'bold',
  cursor: 'pointer',
};
const forgotStyle = {
  display: 'block',
  margin: '10px auto',
  cursor: 'pointer',
  color: 'blue',
  textDecoration: 'underline',
  fontSize: 14,
};

export default UserLogin;