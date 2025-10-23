import React, { useState, useEffect } from 'react';

const DriverLogin = () => {
  // Admin credentials
  const adminUsername = 'crunchtimeadmin';
  const adminPassword = 'crunchtimeadmin12';

  // Load driver data from local storage
  const storedDriver = JSON.parse(localStorage.getItem('registeredUser')) || {};

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [driverApproved, setDriverApproved] = useState(false); // set true when approved
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [userType, setUserType] = useState(null); // 'driver' or 'admin'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Initialize modal on component mount
  useEffect(() => {
    setShowLoginModal(true);
  }, []);

  // Generate OTP
  const generateOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    alert(`OTP sent to Email: ${storedDriver.email}. (OTP: ${newOtp})`);
  };

  // Handle login button click
const handleLogin = () => {
  const emailLower = email.trim().toLowerCase();
  const pass = password.trim();

  if (!userType) {
    alert('Please select Driver or Admin login.');
    return;
  }

  if (userType === 'driver') {
    if (storedDriver.email && storedDriver.email.toLowerCase() === emailLower && storedDriver.password === pass) {
      localStorage.setItem('currentUser', JSON.stringify(storedDriver));
      if (driverApproved) {
        // Redirect to driver dashboard
        window.location.href='http://127.0.0.1:5500/driver-app/index.html';
      } else {
        generateOtp();
        setShowOtpModal(true);
      }
    } else {
      alert('Invalid driver credentials.');
    }
  } else if (userType === 'admin') {
    if (emailLower === adminUsername && pass === adminPassword) {
      window.location.href='http://127.0.0.1:5500/driver-app/admin/admin_dashboard.html';
    } else {
      alert('Invalid admin credentials.');
    }
  }
  setUserType(null);
};

// OTP verification
const handleVerifyOtp = () => {
  if (otp.trim() === generatedOtp) {
    setOtpVerified(true);
    alert('OTP verified! Awaiting admin approval...');
    setShowOtpModal(false);
    if (driverApproved) {
      alert('Login successful! Accessing driver dashboard...');
      window.location.href='http://127.0.0.1:5500/driver-app/index.html';
    } else {
      alert('Your account is still pending approval. Please wait.');
    }
  } else {
    alert('Incorrect OTP. Please try again.');
  }
};

// Resend OTP
const handleResendOtp = () => {
  generateOtp();
  alert('OTP resent.');
};

return (
  <div>
    {/* Login Modal */}
    {showLoginModal && (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <img src="img/screenshot (251).jpg" alt="Welcome" style={{ width: 250, marginBottom: 20 }} />
          <h2>Welcome</h2>
          <h3>Login</h3>
          <p>Welcome to CrunchTime halaal food delivery. Login to start ordering.</p>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {/* Forgot Password Link */}
          <a
            href="http://127.0.0.1:5500/driver-app/forgotpassword.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', textAlign: 'center', margin: '10px auto', cursor: 'pointer', color: 'blue', textDecoration: 'underline', fontSize: 14 }}
          >
            Forgot Password
          </a>
          <button
            onClick={handleLogin}
            style={{ ...styles.button, backgroundColor: 'red', color: '#fff', width: '100%', marginTop: 20 }}
          >
            Login
          </button>
          {/* Buttons for Driver and Admin */}
          <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              style={styles.redirectBtn}
              onClick={() => {
                // Redirect directly to driver app page
                window.location.href='http://127.0.0.1:5500/driver-app/index.html';
              }}
            >
              Driver
            </button>
            <button
              style={styles.redirectBtn}
              onClick={() => {
                setUserType('admin');
                setShowLoginModal(true);
              }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    )}

    {/* OTP Modal */}
    {showOtpModal && (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <h3>Verify Account</h3>
          <p>Please enter the OTP number sent to your email to reset your password</p>
          <input
            type="text"
            maxlength={4}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
          />
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-around' }}>
            <button onClick={handleVerifyOtp}>Confirm</button>
            <button onClick={handleResendOtp}>Resend OTP</button>
          </div>
        </div>
      </div>
    )}
  </div>
);

const styles = {
  modal: {
    display: 'flex',
    position: 'fixed',
    zIndex: 2000,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: 300,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    padding: 8,
    marginTop: 10,
  },
  button: {
    marginTop: 15,
    padding: '8px 12px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: 5,
    fontWeight: 'bold',
  },
  redirectBtn: {
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 5,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default DriverLogin;