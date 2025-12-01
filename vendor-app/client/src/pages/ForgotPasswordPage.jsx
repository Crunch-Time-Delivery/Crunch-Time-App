import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');

  // Initialize Supabase client
  const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY; // or hardcode for testing
  const supabase = React.useMemo(() => require('@supabase/supabase-js').createClient(supabaseUrl, supabaseKey), [supabaseKey]);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setMessage('Please enter your email address.');
      setMessageColor('red');
      return;
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'YOUR_RESET_PASSWORD_PAGE_URL', // Replace with your actual URL
      });
      if (error) {
        console.error('Error sending reset email:', error.message);
        setMessage(`Error: ${error.message}`);
        setMessageColor('red');
      } else {
        setMessage(`A password reset link has been sent to ${email}.`);
        setMessageColor('black');
      }
    } catch (err) {
      console.error(err);
      setMessage(`An unexpected error occurred.`);
      setMessageColor('red');
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '80px auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <img src="img/screenshot (251).jpg" alt="Welcome" style={{ width: '250px', marginBottom: '20px' }} />
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
        onClick={handleResetPassword}
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
      <div id="message" style={{ marginTop: '20px', fontSize: '14px', color: messageColor }}>
        {message}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;