import React, { useState, useEffect } from 'react';

const ForgotPassword = () => {
  const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
  const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your actual Supabase anon key
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Show the forgot password modal on component mount
    setShowForgotModal(true);
  }, []);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }
    try {
      const { data, error } = await supabase.auth.api.resetPasswordForEmail(email);
      if (error) {
        alert('Error: ' + error.message);
      } else {
        setShowForgotModal(false);
        setShowSuccessModal(true);
      }
    } catch (err) {
      alert('Unexpected error: ' + err.message);
    }
  };

  return (
    <div>
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Reset Password</h2>
            <label htmlFor="emailInput">Enter your email</label>
            <input
              type="email"
              id="emailInput"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <button
              onClick={handleResetPassword}
              style={{ ...styles.button, backgroundColor: 'red', color: '#fff', width: '100%' }}
            >
              Send Reset Email
            </button>
          </div>
        </div>
      )}

      {/* Success Message Modal */}
      {showSuccessModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Check your email</h2>
            <p>If the email exists, a password reset link has been sent.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{ ...styles.button, marginTop: 10 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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
};

export default ForgotPassword;