
import React, { useState, useEffect } from 'react';

// Make sure to install supabase: npm install @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;//  actual key
const supabase = createClient(supabaseUrl, supabaseKey);

function DriverLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('driver'); // or 'admin'
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [driverData, setDriverData] = useState(null);
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Load driver data from localStorage or fetch from API
    const data = JSON.parse(localStorage.getItem('registeredUser'));
    setDriverData(data);
  }, []);

  const showNotification = (msg, type) => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async () => {
    if (userType === 'driver') {
      const { data, error } = await supabase
        .from('Drivers')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !data) {
        showNotification('Driver not found.', 'error');
        return;
      }
      if (data.password === password) {
        localStorage.setItem('currentUser', JSON.stringify(data));
        if (data.approved) {
          window.location.href = '/mainpage.html'; // your main page
        } else {
          generateAndSendOtp();
          setShowOtpModal(true);
        }
      } else {
        showNotification('Incorrect password.', 'error');
      }
    }
  };

  const generateAndSendOtp = () => {
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);
    alert(`OTP sent to Email: ${driverData?.email}. (OTP: ${otpCode})`);
    // Call your API to send OTP email here
    fetch('/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: driverData?.contact, otp: otpCode }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) alert(`OTP sent to ${driverData?.contact}`);
        else alert('Failed to send OTP.');
      })
      .catch(() => alert('Error sending OTP.'));
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      alert('OTP verified! Waiting for admin approval...');
      setShowOtpModal(false);
      if (driverData?.approved) {
        alert('Login successful!');
        window.location.href = '/mainpage.html';
      } else {
        alert('Waiting for admin approval.');
      }
    } else {
      alert('Incorrect OTP.');
    }
  };

  return (
    <div>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Login Form */}
      <div>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => (window.location.href = '/mainpage.html')}>
          Driver
        </button>
        {/* OTP Modal */}
        {showOtpModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Verify Account</h3>
              <p>
                Please enter the OTP number sent to your email to reset your
                password
              </p>
              <input
                type="text"
                maxLength={4}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div style={{ marginTop: '10px' }}>
                <button onClick={verifyOtp}>Confirm</button>
                <button
                  onClick={() => {
                    generateAndSendOtp();
                  }}
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverLogin;

/* Add appropriate CSS for modal and notifications in your CSS file */