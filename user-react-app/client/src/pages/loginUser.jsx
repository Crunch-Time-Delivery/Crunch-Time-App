import React, { useState } from 'react';

function UserAuth() {
  const [showLogin, setShowLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [notification, setNotification] = useState('');
  const [userRole, setUserRole] = useState(null); // e.g., 'user', 'admin', 'driver'

  // Hardcoded credentials for testing
  const hardcodedEmail = 'user@example.com';
  const hardcodedPassword = 'password123';

  const handleLogin = () => {
    // Verify credentials
    if (email === hardcodedEmail && password === hardcodedPassword) {
      // simulate OTP send
      setNotification('OTP sent to your email');
      setShowLogin(false);
      setShowOtp(true);
    } else {
      setNotification('Invalid email or password');
    }
  };

  const verifyOtp = () => {
    if (otp === '1234') {
      setNotification('OTP verified! Login successful.');
      // Set user role based on backend data (here hardcoded)
      setUserRole('user'); // or 'admin', 'driver' based on your data
      // Redirect or show role-based content
    } else {
      setNotification('Invalid OTP. Please try again.');
    }
  };

  const handlePasswordRecovery = () => {
    // Skeleton: connect to backend for password reset
    setNotification('Password reset link sent to your email');
  };

  // Role-based access enforcement (example)
  const renderRoleBasedContent = () => {
    if (userRole === 'user') {
      return <h2>Welcome, User!</h2>;
    } else if (userRole === 'admin') {
      return <h2>Admin Dashboard</h2>;
    } else if (userRole === 'driver') {
      return <h2>Driver Panel</h2>;
    }
    return null;
  };

  return (
    <>
      {/* Notification message */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            backgroundColor: '#333',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: 4,
            zIndex: 999,
          }}
        >
          {notification}
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <img
              src="img/screenshot (251).jpg"
              alt="Welcome"
              style={{ width: 250, marginBottom: 20 }}
            />
            <h2>Welcome</h2>
            <h3>Login</h3>
            <p>Welcome to CrunchTime halal food delivery. Login to start ordering.</p>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a
              href="#"
              onClick={handlePasswordRecovery}
              style={{ display: 'block', marginTop: 10, color: 'blue', cursor: 'pointer' }}
            >
              Forgot Password
            </a>
            <button
              style={{
                marginTop: 20,
                backgroundColor: 'red',
                color: '#fff',
                padding: 10,
                border: 'none',
                borderRadius: 5,
                width: '100%',
                cursor: 'pointer',
              }}
              onClick={handleLogin}
            >
              Login
            </button>
            <div id="buttonContainer" style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
              <button
                className="redirectBtn"
                onClick={() => alert('Register flow here')}
                style={{
                  backgroundColor: 'green',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 5,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtp && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <h3>Verify Account</h3>
            <p>Please enter the OTP sent to your email to verify your account</p>
            <input
              type="text"
              maxLength={4}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div style={{ marginTop: 10, display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={verifyOtp} style={{ padding: '8px 12px' }}>
                Confirm
              </button>
              <button
                onClick={() => {
                  // Resend OTP logic here
                  setNotification('OTP resent to your email');
                }}
                style={{ padding: '8px 12px' }}
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role-based content */}
      {userRole && renderRoleBasedContent()}
    </>
  );
}

export default UserAuth;