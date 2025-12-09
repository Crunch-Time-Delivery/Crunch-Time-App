function Connection() {
  const { useState } = React;

  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY; // Actual key
  const supabase = createClient(supabaseUrl, supabaseKey);

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
        setShowModal(false);
        setShowSuccess(true);
      }
    } catch (err) {
      alert('Unexpected error: ' + err.message);
    }
  };

  // The JSX remains the same...
  return (
    <div>
      {/* Trigger button */}
      <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', backgroundColor: 'red', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Forgot Password
      </button>

      {/* Modal for email input */}
      {showModal && (
        <div style={{
          display: 'flex', position: 'fixed', zIndex: 2000, top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '300px', textAlign: 'center'
          }}>
            <h2>Reset Password</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '80%', padding: '8px', marginTop: '10px' }}
            />
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={handleResetPassword}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'red',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Send Reset Email
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: '10px',
                background: 'none',
                border: 'none',
                color: 'blue',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccess && (
        <div style={{
          display: 'flex', position: 'fixed', zIndex: 2000, top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '300px', textAlign: 'center'
          }}>
            <h2>Check your email</h2>
            <p>If the email exists, a password reset link has been sent.</p>
            <button
              onClick={() => setShowSuccess(false)}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: 'blue',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}