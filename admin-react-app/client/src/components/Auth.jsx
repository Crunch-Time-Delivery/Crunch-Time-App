import React, { useState } from 'react';

export function Auth({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'crunchtimeadmin' && password === 'crunchtimeadmin') {
      alert('Login successful!');
      onSuccess(username);
    } else {
      alert('Invalid credentials.');
    }
  };

  return (
    <div id="loginModal" className="modal" style={{ display: 'flex' }}>
      <div className="modal-box">
        {/* Your login form UI */}
        <h2>Login</h2>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}