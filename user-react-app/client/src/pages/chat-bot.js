const CLIENT_ID = '866867707128-mq963ediu3mijf16r27c8e1fgnmp2h3f';

window.onload = () => {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleGoogleSignIn
  });
  google.accounts.id.renderButton(
    document.getElementById("googleSignInButton"),
    { theme: "outline", size: "medium" }
  );
  
  // Load existing history if user was already logged in (simulated)
  loadChatHistory();
};

function handleGoogleSignIn(response) {
  const payload = parseJwt(response.credential);
  window.currentUser = {
    name: payload.name,
    avatar: payload.picture
  };
  updateUIAfterLogin();
  addMessage("Logged in! How can I help you today?", "bot", false);
}

function parseJwt(token) {
  return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
}

function updateUIAfterLogin() {
  document.getElementById("topBar").innerHTML = `
    <div style="display:flex;align-items:center;gap:10px">
      <img src="${currentUser.avatar}" style="width:30px;height:30px;border-radius:50%">
      <span>Hi, ${currentUser.name.split(' ')[0]}</span>
    </div>
    <div>
      <button onclick="clearChat()">Clear Chat</button>
      <button onclick="logout()">Logout</button>
    </div>
  `;
  const input = document.getElementById("messageInput");
  input.disabled = false;
  input.placeholder = "Type a message...";
  document.getElementById("sendBtn").disabled = false;
  input.focus();
}

function handleKeyPress(e) {
  if (e.key === "Enter") sendMessage();
}

async function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";
  
  const typingId = "typing-" + Date.now();
  const typingDiv = addMessage("DeepAI is thinking...", "bot", false, typingId);
  
  const reply = await generateDeepAiResponse(text);
  
  document.getElementById(typingId).remove();
  addMessage(reply, "bot");
}

// Function to generate response from DeepAI API
async function generateDeepAiResponse(message) {
  const apiKey = 'quickstart-QUdJIGlzIGNvbWJlZC4'; // Replace with your actual API key for production
  const url = 'https://api.deepai.org/api/text-generator';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: message,
        // Additional parameters can be added here if supported
      }),
    });

    const data = await response.json();

    if (data && data.output) {
      return data.output;
    } else {
      throw new Error('Invalid response from DeepAI API');
    }
  } catch (error) {
    console.error('Error:', error);
    return 'Sorry, I encountered an error.';
  }
}

// Function to add a message to the chat window
function addMessage(text, type, save = true, id = null) {
  const messagesDiv = document.getElementById("messages");
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  if (id) div.id = id;
  div.innerHTML = `${text} <span class="time">${time}</span>`;
  
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  if (save) {
    saveMessageToHistory({ text, type, time });
  }
  return div;
}

// Function to fetch supplementary data
async function fetchAdditionalData(endpoint) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

// Function to clear all messages
function clearMessages() {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = '';
  localStorage.removeItem('messageHistory');
}

// Function to save messages to local storage
function saveMessageToHistory(message) {
  let history = JSON.parse(localStorage.getItem('messageHistory')) || [];
  history.push(message);
  localStorage.setItem('messageHistory', JSON.stringify(history));
}

// Function to load message history from local storage
function loadMessageHistory() {
  const history = JSON.parse(localStorage.getItem('messageHistory')) || [];
  history.forEach(msg => {
    addMessage(msg.text, msg.type, false, null);
  });
}

// Function to simulate typing indicator
function simulateTyping(duration = 2000) {
  const chatContainer = document.getElementById('messages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'msg typing';
  typingDiv.innerHTML = 'Bot is typing... <span class="dots">...</span>';
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  return new Promise(resolve => {
    setTimeout(() => {
      chatContainer.removeChild(typingDiv);
      resolve();
    }, duration);
  });
}

// Function to automatically reply after receiving a message
async function autoReply(userMessage) {
  await simulateTyping();
  const reply = await generateDeepAiResponse(userMessage);
  addMessage(reply, 'bot');
}

// Call loadMessageHistory on page load to display saved messages
window.onload = () => {
  loadMessageHistory();
};

function loadChatHistory() {
  let history = JSON.parse(localStorage.getItem("chat_history")) || [];
  history.forEach(m => addMessage(m.text, m.type, false));
}

function clearChat() {
  if(confirm("Clear all messages?")) {
    localStorage.removeItem("chat_history");
    document.getElementById("messages").innerHTML = "";
  }
}

function logout() {
  localStorage.removeItem("chat_history");
  location.reload();
}