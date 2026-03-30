
import React, { useState, useEffect } from 'react';
// Make sure to install @supabase/supabase-js: npm install @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_PUBLIC_ANON_KEY'; // replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

function ForgotResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('black');

  const [newPassword, setNewPassword] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateMessageColor, setUpdateMessageColor] = useState('black');

  const [showResetForm, setShowResetForm] = useState(false);

  // Check URL for access_token to switch to reset password form
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    if (accessToken) {
      setShowResetForm(true);
    }
  }, []);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setMessage('Please enter your email address.');
      setMessageColor('red');
      return;
    }
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://yourdomain.com/resetpassword' // replace with your reset password page URL
      });
      if (error) {
        console.error(error.message);
        setMessage('Error: ' + error.message);
        setMessageColor('red');
      } else {
        setMessage(`A password reset link has been sent to ${email}.`);
        setMessageColor('black');
      }
    } catch (err) {
      console.error(err);
      setMessage('An unexpected error occurred.');
      setMessageColor('red');
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) {
      setUpdateMessage('Please enter a new password.');
      setUpdateMessageColor('red');
      return;
    }
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error(error.message);
        setUpdateMessage('Error: ' + error.message);
        setUpdateMessageColor('red');
      } else {
        setUpdateMessage('Your password has been updated successfully.');
        setUpdateMessageColor('green');
        // Optionally, redirect to login page
      }
    } catch (err) {
      console.error(err);
      setUpdateMessage('An unexpected error occurred.');
      setUpdateMessageColor('red');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f2f2f2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!showResetForm ? (
        <div style={{
          maxWidth: '400px',
          margin: '80px auto',
          padding: '30px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <img src="img/screenshot (251).jpg" alt="Welcome" style={{ width: '250px', height: 'auto', marginBottom: '20px' }} />
          <h2>Forgot Password</h2>
          <p>Enter your email address to reset your password.</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '80%',
              padding: '10px',
              marginTop: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <br />
          <button
            onClick={handleForgotPassword}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#ff0000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reset Password
          </button>
          <div style={{ marginTop: '20px', fontSize: '14px', color: messageColor }}>
            {message}
          </div>
        </div>
      ) : (
        <div style={{
          maxWidth: '400px',
          margin: '80px auto',
          padding: '30px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2>Set New Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              width: '80%',
              padding: '10px',
              marginTop: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <br />
          <button
            onClick={handleUpdatePassword}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#ff0000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Update Password
          </button>
          <div style={{ marginTop: '20px', fontSize: '14px', color: updateMessageColor }}>
            {updateMessage}
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotResetPassword;