import React from 'react';

const WelcomePage = () => {
  const handleCreateAccount = () => {
    window.location.href = 'http://127.0.0.1:5500/user-app/register_home.html';
  };

  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:5500/user-app/loginUser.html';
  };

  return (
    <div style={{
      margin: 0,
      padding: 0,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f4',
      height: '100vh',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
        <div style={{
          maxWidth: '350px',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          background: '#fff',
          textAlign: 'center',
        }}>
          <img 
            src="img/screenshot (250).jpg" 
            alt="Welcome Image" 
            style={{ width: '250px', height: 'auto', marginBottom: '20px' }} 
          />
          <h2 style={{ color: 'gray' }}>Welcome</h2>
          <p>Before enjoying CrunchTime deliveries</p>
          <div style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <button
              id="createAccountBtn"
              style={{
                background: '#f60202',
                color: '#fff',
                padding: '12px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1em',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onClick={handleCreateAccount}
            >
              Create account
            </button>
            <button
              id="loginBtn"
              style={{
                background: '#fff',
                color: '#f60202',
                padding: '12px',
                border: '1px solid #f60202',
                borderRadius: '4px',
                fontSize: '1em',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              id="browserMenuBtn"
              style={{
                background: '#f60202',
                color: '#fff',
                padding: '12px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1em',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onClick={() => window.location.href='dummy.html'}
            >
              Browser Menu
            </button>
          </div>
          <p style={{ marginTop: '20px', fontSize: '14px' }}>
            By logging in or registering, you have agreed to the{' '}
            <a href="http://127.0.0.1:5500/driver-app/terms-and-conditions.page.html" target="_blank" rel="noopener noreferrer" style={{ color: '#f60202', textDecoration: 'underline' }}>
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="dummy_privacy.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#f60202', textDecoration: 'underline' }}>
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;