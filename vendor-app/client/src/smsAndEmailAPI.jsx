const [phoneNumber, setPhoneNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailText, setEmailText] = useState('');
  const [status, setStatus] = useState('');

  const sendSMS = () => {
    fetch('/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phoneNumber, message: smsMessage }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('SMS sent! SID: ' + data.sid);
        } else {
          setStatus('Failed to send SMS.');
        }
      })
      .catch((err) => setStatus('Error: ' + err.message));
  };

  const sendEmail = () => {
    fetch('/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, subject: emailSubject, text: emailText }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('Email sent!');
        } else {
          setStatus('Failed to send email.');
        }
      })
      .catch((err) => setStatus('Error: ' + err.message));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Send SMS & Email</h1>
      
      {/* SMS Section */}
      <h2>Send SMS</h2>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        style={{ width: '300px', marginBottom: '10px' }}
      />
      <br />
      <textarea
        placeholder="Message"
        value={smsMessage}
        onChange={(e) => setSmsMessage(e.target.value)}
        style={{ width: '300px', height: '80px', marginBottom: '10px' }}
      />
      <br />
      <button onClick={sendSMS}>Send SMS</button>
      
      {/* Email Section */}
      <h2 style={{ marginTop: '30px' }}>Send Email</h2>
      <input
        type="email"
        placeholder="Recipient Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '300px', marginBottom: '10px' }}
      />
      <br />
      <input
        type="text"
        placeholder="Subject"
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
        style={{ width: '300px', marginBottom: '10px' }}
      />
      <br />
      <textarea
        placeholder="Email Body"
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        style={{ width: '300px', height: '100px', marginBottom: '10px' }}
      />
      <br />
      <button onClick={sendEmail}>Send Email</button>

      <p style={{ marginTop: '20px' }}>{status}</p>
    </div>
  );