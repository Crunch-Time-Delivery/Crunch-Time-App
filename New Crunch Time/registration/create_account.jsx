import React, { useState } from 'react';

// Initialize Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this environment variable is set
const supabase = createClient(supabaseUrl, supabaseKey);

function CreateAccount() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleCreateAccount = async () => {
    if (!fullName || !email || !phone || !password) {
      setError('Please fill all fields');
      return;
    }

    // Save account info to Supabase
    const { data, error } = await supabase
      .from('Account')
      .insert([{ full_name: fullName, email: email, phone: phone, password: password }])
      .select();

    if (error) {
      setError('Error creating account: ' + error.message);
    } else {
      alert('Account created successfully!');
      // Save email to localStorage for OTP
      localStorage.setItem('email', email);
      window.location.href = 'otp.html'; // or OTP React page
    }
  };

  return (
    <div className="form-container">
      <h1 style={{ color: 'red' }}>crunchtime</h1>
      <h2 style={{ color: 'grey' }}>Create Account</h2>
      <p>Welcome To CrunchTime Halaal Food Delivery. Signup To Create A Free Account To Start Ordering</p>

      {/* Error Message */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Terms and Conditions Checkbox */}
      <div className="error-box">
        <input type="checkbox" className="checkbox" id="terms" />
        <label style={{ color: 'grey', cursor: 'pointer' }} htmlFor="terms">
          By logging or Registering, You Have Agreed To the <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => setShowTerms(true)}>Terms & Conditions</span> and <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => setShowPrivacy(true)}>Privacy Policy</span>
        </label>
      </div>

      {/* Input Fields */}
      <input
        type="text"
        placeholder="Enter full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Already Have an Account */}
      <p style={{ color: 'red', cursor: 'pointer' }} onClick={() => window.location.href='login.html'}>
        Already Have An Account? Login
      </p>

      {/* Create Account Button */}
      <button onClick={handleCreateAccount}>Create Account</button>

      {/* Terms & Privacy Popups */}
      {showTerms && (
        <div className="popup">
          <h3>Terms & Conditions</h3>
          <p>Here are the terms and conditions...</p>
          <button onClick={() => setShowTerms(false)}>OK</button>
        </div>
      )}
      {showPrivacy && (
        <div className="popup">
          <h3>Privacy Policy</h3>
          <p>Here is the privacy policy...</p>
          <button onClick={() => setShowPrivacy(false)}>OK</button>
        </div>
      )}
    </div>
  );
}

export default CreateAccount;