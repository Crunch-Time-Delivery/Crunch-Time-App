// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// In-memory database (for demonstration)
let users = [];

// Middleware to enforce authentication
function authMiddleware(req, res, next) {
  const email = req.headers['x-user-email'];
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: User not found' });
  }
  req.user = user; // Attach user to request
  next();
}

// Middleware to enforce admin role
function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
}

// Middleware to enforce driver approval
function driverApprovedMiddleware(req, res, next) {
  if (req.user.role === 'driver' && !req.user.approved) {
    return res.status(403).json({ message: 'Driver not approved' });
  }
  next();
}

// Register user
app.post('/register', (req, res) => {
  const { email, password, role } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  const newUser = { email, password, role, approved: false };
  users.push(newUser);
  res.json({ message: 'Registration successful' });
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // For simplicity, return user data (in real app, use tokens)
  res.json({ email: user.email, role: user.role, approved: user.approved });
});

// OTP verification
app.post('/verify-otp', authMiddleware, (req, res) => {
  const { otp } = req.body;
  // Assume OTP is valid for demo
  if (otp === '1234') { // Replace with real OTP check
    req.user.approved = true;
    res.json({ message: 'OTP verified and user approved' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

// Protected route example
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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});