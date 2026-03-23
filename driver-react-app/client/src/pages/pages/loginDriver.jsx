import React, { useState } from 'react';

function App() {
  // Simulated user list
  const [users, setUsers] = useState([
    { email: 'driver1@example.com', pass: 'driver123', role: 'driver', approved: false },
  ]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [roleInput, setRoleInput] = useState('driver');

  // Notification state
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const showNotification = (msg, type='success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleAuth = () => {
    if (isRegister) {
      if (users.some(u => u.email === emailInput)) {
        showNotification('Email already exists', 'error');
        return;
      }
      const newUser = {
        email: emailInput,
        pass: passInput,
        role: roleInput,
        approved: roleInput !== 'driver'
      };
      setUsers([...users, newUser]);
      showNotification('Registration successful! Please login.');
      setIsRegister(false);
    } else {
      // Remove admin code, only user login
      const user = users.find(u => u.email === emailInput && u.pass === passInput);
      if (user) {
        setCurrentUser(user);
        if (user.role === 'driver') {
          if (user.approved) {
            window.location.href = '/driver_mainpage'; // your driver page
          } else {
            generateOTP();
            setShowOTP(true);
          }
        }
      } else {
        showNotification('Invalid credentials', 'error');
      }
    }
  };

  const generateOTP = () => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otpCode);
    alert(`OTP (demo): ${otpCode}`); // Replace with real SMS API
  };

  const verifyOTP = () => {
    if (otp === generatedOTP) {
      alert('OTP verified! Account approved.');
      const updatedUser = { ...currentUser, approved: true };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.email === updatedUser.email ? updatedUser : u));
      setShowOTP(false);
      window.location.href = '/driver_mainpage'; // your driver page
    } else {
      alert('Incorrect OTP.');
    }
  };

  const resendOTP = () => {
    generateOTP();
    alert('OTP resent.');
  };

  const handlePasswordReset = () => {
    alert('Password reset link sent (simulate).');
    setShowResetModal(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Notification */}
      {notification.message && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 20px',
          backgroundColor: notification.type === 'success' ? '#4CAF50' : '#f44336',
          color: '#fff',
          borderRadius: '5px',
          zIndex: 999,
        }}>
          {notification.message}
        </div>
      )}

      {/* Full focus on Login/Register */}
      <div style={{
        width: '90%',
        maxWidth: '500px',
        background: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <h2 style={{ textAlign: 'center' }}>{isRegister ? 'Register' : 'Login'}</h2>
        {/* Email */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            style={{ width: '100%', padding: '8px' }}
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </div>
        {/* Password */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px' }}
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
          />
        </div>
        {/* Role selection during registration */}
        {isRegister && (
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Role:</label>
            <select
              style={{ width: '100%', padding: '8px' }}
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
            >
              <option value="driver">Driver</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}
        {/* Submit button */}
        <button
          onClick={handleAuth}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'red',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px',
          }}
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
        {/* Links */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); }}
            style={{ display: 'block', marginBottom: '8px', fontSize: '0.9em', color: 'blue' }}
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setShowResetModal(true); }}
            style={{ fontSize: '0.9em', color: 'blue' }}
          >
            Forgot Password?
          </a>
        </div>
      </div>

      {/* OTP Modal */}
      {showOTP && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999,
        }}>
          <div style={{
            background: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '300px', width: '90%', textAlign: 'center',
          }}>
            <h3>Verify OTP</h3>
            <p>Enter the OTP sent to your email/phone</p>
            <input
              type="text"
              maxLength={6}
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: '100%', padding: '8px', margin: '10px 0' }}
            />
            <button
              onClick={verifyOTP}
              style={{
                width: '100%', padding: '10px', backgroundColor: 'red', color: '#fff', border: 'none', borderRadius: '4px', marginTop: '10px'
              }}
            >
              Confirm
            </button>
            <button
              onClick={resendOTP}
              style={{
                width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px'
              }}
            >
              Resend OTP
            </button>
          </div>
        </div>
      )}

      {/* Password Reset Modal Skeleton */}
      {showResetModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999,
        }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '300px', width: '90%', textAlign: 'center' }}>
            <h3>Password Reset</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', margin: '10px 0' }}
            />
            <button
              onClick={handlePasswordReset}
              style={{
                width: '100%', padding: '10px', backgroundColor: 'red', color: '#fff', border: 'none', borderRadius: '4px'
              }}
            >
              Send Reset Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;