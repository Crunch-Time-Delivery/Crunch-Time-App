import React, { useState, useEffect } from 'react';

// Initialize Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this environment variable is set
const supabase = createClient(supabaseUrl, supabaseKey);

function OTPVerification() {
  const [otpCodes, setOtpCodes] = useState(['', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Fetch email stored from previous page (localStorage used for demo)
    const prevEmail = localStorage.getItem('email') || '';
    setEmail(prevEmail);
    sendOTP(prevEmail);
  }, []);

  const sendOTP = async (email) => {
    // Replace with real OTP sending logic
    console.log(`Sending OTP to ${email}`);
    setMessage(`OTP sent to ${email}`);
    // Implement server-side OTP send via email here
  };

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtpCodes = [...otpCodes];
      newOtpCodes[index] = value;
      setOtpCodes(newOtpCodes);
      if (value && index < 4) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleVerify = () => {
    const enteredOtp = otpCodes.join('');
    // Replace with actual OTP verification logic
    if (enteredOtp === '12345') { // For demo, assume '12345' is correct
      alert('OTP verified successfully!');
      // Proceed to login or next step
    } else {
      alert('Incorrect OTP, please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ color: 'black' }}>Verify Account</h1>
      <p style={{ color: 'black' }}>Please enter the OTP number sent to your email to reset your password</p>
      <p style={{ backgroundColor: 'grey', padding: '10px', width: 'fit-content', margin: '0 auto' }}>Enter your OTP code here</p>
      
      <div className="otp-container">
        {otpCodes.map((code, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            maxLength="1"
            className="otp-input"
            value={code}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}
      </div>
      
      <p style={{ color: 'red', cursor: 'pointer' }} onClick={() => sendOTP(email)}>Didn't receive code? Request again</p>
      
      <button style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px', marginTop: '20px' }} onClick={handleVerify}>Confirm</button>
    </div>
  );
}

export default OTPVerification;