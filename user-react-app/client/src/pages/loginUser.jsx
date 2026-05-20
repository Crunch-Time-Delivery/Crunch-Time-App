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
function SmsComponent() {
  const [notifications, setNotifications] = useState([]);

  // Helper to add notifications
  const showNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 3000);
  };

  // Send SMS
  const sendSms = async (toNumber, message) => {
    try {
      const response = await fetch('http://localhost:5501/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: toNumber, message })
      });
      const data = await response.json();

      if (data.success) {
        showNotification('SMS sent successfully.', 'success');
      } else {
        showNotification(`Failed to send SMS: ${data.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      showNotification(`Error sending SMS: ${error.message}`, 'error');
    }
  };

  // Check message status
  const checkMessageStatus = async (messageSid) => {
    try {
      const response = await fetch('http://localhost:3001/twilio-message-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageSid }),
      });
      return await response.json();
    } catch {
      showNotification('Error fetching message status.', 'error');
      return null;
    }
  };

  // Fetch message logs
  const fetchMessageLogs = async (limit = 10) => {
    try {
      const response = await fetch(`http://localhost:3001/twilio-message-logs`);
      const data = await response.json();
      return data;
    } catch {
      showNotification('Error fetching message logs.', 'error');
      return [];
    }
  };

  // Callbacks
  const onSendSuccess = (sid) => {
    console.log(`Message sent successfully. SID: ${sid}`);
    showNotification(`Message sent! SID: ${sid}`, 'success');
  };

  const onSendFailure = (error) => {
    console.error('Failed to send message:', error);
    showNotification(`Failed to send message: ${error}`, 'error');
  };

  const onStatusUpdate = (statusData) => {
    console.log('Message status update:', statusData);
    showNotification(`Status: ${statusData.status} for SID: ${statusData.sid}`, 'info');
  };

  const onError = (errorMsg) => {
    console.error('Error:', errorMsg);
    showNotification(`Error: ${errorMsg}`, 'error');
  };

  // Monitor message status
  const monitorMessageStatus = (sid, intervalMs = 5000) => {
    const intervalId = setInterval(async () => {
      const statusData = await checkMessageStatus(sid);
      if (statusData) {
        onStatusUpdate(statusData);
        if (statusData.status === 'delivered' || statusData.status === 'failed') {
          clearInterval(intervalId);
        }
      }
    }, intervalMs);
    // Cleanup
    return () => clearInterval(intervalId);
  };

  // Example usage inside component
  // You could trigger sendSms, monitorMessageStatus, etc., via buttons or effects

  return (
    <div>
      {/* Notifications */}
      <div className="notifications">
        {notifications.map(({ id, message, type }) => (
          <div key={id} className={`notification ${type}`}>
            {message}
          </div>
        ))}
      </div>
      {/* Your UI for sending SMS, etc., goes here */}
    </div>
  );
}


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