const express = require('express');
const path = require('path');
const axios = require('axios');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5501;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build'))); // Serve React build

// Database setup
const db = new sqlite3.Database('admin_dashboard.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    role TEXT
  )`);
});

// ================== PayFast Payment ==================
app.post('/create-payfast-payment', (req, res) => {
  const { amount, item_name } = req.body;
  const paymentUrl = `https://sandbox.payfast.co.za/eng/process?amount=${amount}&item_name=${encodeURIComponent(item_name)}`;
  res.json({ paymentUrl });
});

app.post('/process-payment', (req, res) => {
  const { item_name, amount, name_first, name_last, email_address } = req.body;
  const MERCHANT_ID = '10000100';
  const MERCHANT_KEY = '46f0cd694581a';
  const PASSPHRASE = 'test-payfast';

  const payfastData = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: 'http://localhost:5501/success',
    cancel_url: 'http://localhost:5501/cancel',
    notify_url: 'http://localhost:5501/notify',
    name_first,
    name_last,
    email_address,
    amount: parseFloat(amount).toFixed(2),
    item_name,
  };

  const dataWithPassphrase = { ...payfastData, passphrase: PASSPHRASE };
  let signatureString = '';

  Object.keys(dataWithPassphrase).sort().forEach(key => {
    if (dataWithPassphrase[key]) {
      signatureString += `${key}=${encodeURIComponent(dataWithPassphrase[key]).replace(/%20/g, '+')}&`;
    }
  });
  signatureString = signatureString.slice(0, -1);
  const signature = crypto.createHash('md5').update(signatureString).digest('hex');

  const payfastUrl = 'https://www.payfast.co.za/eng/process?' + new URLSearchParams({ ...payfastData, signature }).toString();
  res.json({ success: true, redirectUrl: payfastUrl });
});

app.get('/success', (req, res) => res.send('Payment successful!'));
app.get('/cancel', (req, res) => res.send('Payment cancelled.'));
app.post('/notify', (req, res) => {
  console.log('ITN received:', req.body);
  res.status(200).send('ITN received');
});

// ================== Twilio SMS ==================
app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;
  const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // replace
  const authToken = 'your_auth_token'; // replace
  const client = twilio(accountSid, authToken);
  try {
    const msg = await client.messages.create({ body: message, from: '+1234567890', to });
    res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// ================== Email Sending ==================
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    auth: { user: 'your_email@example.com', pass: 'your_password' },
  });
  try {
    await transporter.sendMail({ from: '"Your App" <no-reply@yourdomain.com>', to, subject, text });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// ================== Notifications ==================
app.post('/notifications', (req, res) => {
  // handle notifications
  res.json({ message: 'Notification received' });
});

// ================== Admin & User APIs ==================
app.get('/api/admins', (req, res) => {
  db.all('SELECT * FROM admins', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.post('/api/admins', (req, res) => {
  const { username, password } = req.body;
  db.run('INSERT INTO admins (username, password) VALUES (?, ?)', [username, password], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, username });
  });
});
app.put('/api/admins/:id', (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  db.run('UPDATE admins SET username = ?, password = ? WHERE id = ?', [username, password, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Updated successfully' });
  });
});
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.post('/api/users', (req, res) => {
  const { email, role } = req.body;
  db.run('INSERT INTO users (email, role) VALUES (?, ?)', [email, role], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, email, role });
  });
});

// ================== Static & Catch-all ==================
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});