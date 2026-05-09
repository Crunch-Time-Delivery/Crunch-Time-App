import React, { useState, useEffect, useRef } from 'react';

const CLIENT_ID = '866867707128-mq963ediu3mijf16r27c8e1fgnmp2h3f';

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesRef = useRef();

  useEffect(() => {
    // Load chat history
    const history = JSON.parse(localStorage.getItem('messageHistory')) || [];
    setMessages(history);
  }, []);

  useEffect(() => {
    // Scroll to bottom
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages]);

  // Google Sign-In setup
  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse,
    });
    window.google?.accounts.id.renderButton(
      document.getElementById('googleSignIn'),
      { theme: 'outline', size: 'large' }
    );
  }, []);

  const handleCredentialResponse = (response) => {
    const payload = parseJwt(response.credential);
    setUser({ name: payload.name, avatar: payload.picture });
  };

  const parseJwt = (token) => JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));

  const handleSignInClick = () => {
    document.getElementById('googleSignIn').click();
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSend = async () => {
    if (!user) {
      // Show sign-in modal or prompt
      alert('Please sign in first.');
      return;
    }
    if (!input.trim()) return;
    addMessage(input, 'user');
    setInput('');

    addMessage('DeepAI is thinking...', 'bot', false);
    const reply = await fetchDeepAIResponse(input);
    setMessages((msgs) => {
      const newMsgs = [...msgs];
      newMsgs.pop(); // remove 'thinking'
      newMsgs.push({ text: reply, type: 'bot' });
      // Save to local storage
      localStorage.setItem('messageHistory', JSON.stringify(newMsgs));
      return newMsgs;
    });
  };
const getDeepAIResponse = async (message) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/deepai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }

      const data = await response.json();

      if (typeof data.reply !== 'string') {
        console.warn('Unexpected response format:', data);
        setResponse('Sorry, no response.');
      } else {
        setResponse(data.reply);
      }
    } catch (err) {
      console.error('Error calling DeepAI proxy:', err);
      setError('Sorry, there was an error.');
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, error, fetchResponse: getDeepAIResponse };
 

  const addMessage = (text, type, save = true) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { text, type, time };
    setMessages((msgs) => {
      const updated = [...msgs, newMsg];
      if (save) {
        localStorage.setItem('messageHistory', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div style={{ background: '#ef0606', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>AI Chat Bot 🤖</div>
        {!user && <button id="googleSignIn" style={{ background: '#4285F4', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }} onClick={handleSignInClick}>Sign in with Google</button>}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={user.avatar} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
            <span>Hi, {user.name.split(' ')[0]}</span>
            <button style={{ background: '#f00', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      {/* Chat container */}
      <div style={{ maxWidth: 500, margin: '20px auto', background: '#fff', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', height: '80vh' }}>
        {/* Messages */}
        <div ref={messagesRef} style={{ flex: 1, padding: 15, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg ${msg.type}`} style={{
              marginBottom: 12,
              padding: 10,
              borderRadius: 15,
              maxWidth: '80%',
              fontSize: 14,
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
              background: msg.type === 'user' ? '#f20909' : '#f1f3f4',
              color: msg.type === 'user' ? '#fff' : '#333'
            }}>
              {msg.text} <div style={{ fontSize: 10, marginTop: 5, opacity: 0.7 }}>{msg.time}</div>
            </div>
          ))}
        </div>
        {/* Input */}
        <div style={{ display: 'flex', padding: 10, borderTop: '1px solid #eee' }}>
          <input
            style={{ flex: 1, padding: 12, borderRadius: 25, border: '1px solid #ddd', outline: 'none', paddingLeft: 20 }}
            placeholder={user ? 'Type a message...' : 'Please log in...'}
            disabled={!user}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button style={{ background: '#f40404', color: '#fff', border: 'none', padding: '0 20px', marginLeft: 10, borderRadius: 25, cursor: 'pointer' }} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;