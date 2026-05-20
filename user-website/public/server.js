const express = require('express');
const fetch = require('node-fetch'); // Ensure you have this installed
const app = express();

app.use(express.json()); // Built-in body parser in Express 4.16+

// In-memory database (for demonstration)
let users = [];

// Middleware to enforce authentication based on custom header
function authMiddleware(req, res, next) {
  const email = req.headers['x-user-email'];
  if (!email) {
    return res.status(401).json({ message: 'Unauthorized: No email header' });
  }
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: User not found' });
  }
  req.user = user; // Attach user object to request
  next();
}

// Middleware to restrict access to admins only
function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
}

// Middleware to restrict access to approved drivers
function driverApprovedMiddleware(req, res, next) {
  if (req.user.role === 'driver' && !req.user.approved) {
    return res.status(403).json({ message: 'Driver not approved' });
  }
  next();
}

// Register user
app.post('/register', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  const newUser = { email, password, role, approved: false };
  users.push(newUser);
  res.json({ message: 'Registration successful' });
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }
  const user = users.find(u => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // For demonstration, return user info; in real apps, use tokens
  res.json({ email: user.email, role: user.role, approved: user.approved });
});

// OTP verification route
app.post('/verify-otp', authMiddleware, (req, res) => {
  const { otp } = req.body;
  if (otp === '1234') { // Replace with real OTP validation
    req.user.approved = true;
    res.json({ message: 'OTP verified and user approved' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

// Driver data route (protected)
app.get('/driver-data', authMiddleware, driverApprovedMiddleware, (req, res) => {
  if (req.user.role !== 'driver') {
    return res.status(403).json({ message: 'Forbidden: Drivers only' });
  }
  res.json({ data: 'Sensitive driver data' });
});

// Admin-only route
app.get('/admin-data', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ data: 'Sensitive admin data' });
});

// DeepAI API proxy route
const DEEP_AI_API_KEY = 'quickstart-QUdJIGlzIGNvbWJlZC4'; // Replace with your real API key

app.post('/deepai', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const response = await fetch('https://api.deepai.org/api/text-generator', {
      method: 'POST',
      headers: {
        'Api-Key': DEEP_AI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message }),
    });
    const data = await response.json();
    if (response.ok) {
      res.json({ reply: data.output });
    } else {
      console.error('DeepAI API error:', data);
      res.status(500).json({ error: 'DeepAI API error', details: data });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 5501;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});