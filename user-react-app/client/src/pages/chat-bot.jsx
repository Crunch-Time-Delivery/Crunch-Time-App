
import React, { useState, useEffect, useRef } from 'react';
import { getChatbotResponse } from './chatbotData.js';

// Inside your sendMessage() or response logic
const reply = getChatbotResponse(userMessage);
const CLIENT_ID = '866867707128-mq963ediu3mijf16r27c8e1fgnmp2h3f';

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load chat history
    const history = JSON.parse(localStorage.getItem('messageHistory')) || [];
    setMessages(history);
    // Initialize Google Sign-In
    window.google?.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleGoogleSignIn,
    });
    // Render Google Sign-In button in the modal
    if (showSignInModal) {
      window.google.accounts.id.renderButton(
        document.getElementById('modalSignInButton'),
        { theme: 'outline', size: 'medium' }
      );
    }
  }, [showSignInModal]);

  useEffect(() => {
    // scroll to bottom on new message
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messages]);

  const handleGoogleSignIn = (response) => {
    const payload = parseJwt(response.credential);
    setUser({ name: payload.name, avatar: payload.picture });
    addMessage("Logged in! How can I help you today?", 'bot', false);
    setShowSignInModal(false);
  };

  const parseJwt = (token) => {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  };

  const handleSend = async () => {
    if (!user) {
      setShowSignInModal(true);
      return;
    }
    const input = inputRef.current;
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';

    const typingId = `typing-${Date.now()}`;
    addMessage('DeepAI is thinking...', 'bot', false, typingId);
    const reply = await generateDeepAiResponse(text);
    setMessages((msgs) => msgs.filter((m) => m.id !== typingId));
    addMessage(reply, 'bot');
  };

  const generateDeepAiResponse = async (message) => {
    const apiKey = 'quickstart-QUdJIGlzIGNvbWJlZC4'; // Replace with your API Key
    const url = 'https://api.deepai.org/api/text-generator';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      });
      const data = await response.json();
      return data.output || 'Sorry, I encountered an error.';
    } catch {
      return 'Sorry, I encountered an error.';
    }
  };

  const addMessage = (text, type, save=true, id=null) => {
    const newMsg = {
      id: id || `msg-${Date.now()}`,
      text,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((msgs) => {
      const updated = [...msgs, newMsg];
      if (save) {
        localStorage.setItem('messageHistory', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    localStorage.removeItem('messageHistory');
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
      localStorage.removeItem('messageHistory');
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div style={{
        background: '#ef0606', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100
      }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={user.avatar} alt="avatar" style={{ width: 30, height: 30, borderRadius: '50%' }} />
            <span>Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} style={{ marginLeft: 10 }}>Logout</button>
            <button onClick={handleClearChat} style={{ marginLeft: 5 }}>Clear Chat</button>
          </div>
        ) : (
          <div>Please Log In</div>
        )}
      </div>

      {/* Chat Container */}
      <div style={{
        maxWidth: 500,
        margin: '20px auto',
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '80vh'
      }}>
        <div ref={messageRef} style={{ flex: 1, padding: 15, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`msg ${msg.type}`} style={{
              marginBottom: 12,
              padding: 10,
              borderRadius: 15,
              maxWidth: '80%',
              fontSize: 14,
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
              background: msg.type === 'user' ? '#f20909' : '#f1f3f4',
              color: msg.type === 'user' ? '#fff' : '#333',
              borderBottomRightRadius: msg.type === 'user' ? 2 : 15,
              borderBottomLeftRadius: msg.type === 'bot' ? 2 : 15,
            }}>
              {msg.text}
              <div className="time" style={{ fontSize: 10, opacity: 0.7, marginTop: 5 }}>{msg.time}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', padding: 10, borderTop: '1px solid #eee' }}>
          <input
            ref={inputRef}
            disabled={!user}
            placeholder={user ? 'Type a message...' : 'Please log in...'}
            style={{
              flex: 1,
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 25,
              outline: 'none',
              paddingLeft: 20,
            }}
            onKeyPress={handleKeyPress}
          />
          <button
            style={{
              background: '#f40404',
              color: '#fff',
              border: 'none',
              padding: '0 20px',
              marginLeft: 10,
              borderRadius: 25,
              cursor: 'pointer',
            }}
            onClick={handleSend}
            disabled={!user}
          >
            Send
          </button>
        </div>
      </div>

      {/* Sign-In Modal */}
      {showSignInModal && (
        <div style={{
          display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div style={{
            background: '#fff', padding: 30, borderRadius: 10, maxWidth: 400, width: '80%', textAlign: 'center'
          }}>
            <h2>Please Sign In</h2>
            <div id="modalSignInButton"></div>
            <button style={{ marginTop: 20, padding: '10px 20px', border: 'none', borderRadius: 5, background: '#ef0606', color: '#fff', cursor: 'pointer' }} onClick={() => setShowSignInModal(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;