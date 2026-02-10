// server.js
const express = require('express');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto'); // Needed for signature hashing

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build'))); // Serve React build

// PayFast credentials (replace with your live credentials for production)
const MERCHANT_ID = '10000100'; // Sandbox Merchant ID
const MERCHANT_KEY = '46f0cd694581a'; // Sandbox Merchant Key
const PASSPHRASE = 'test-payfast'; // Sandbox Passphrase

// 1. Endpoint to create PayFast payment URL
app.post('/create-payfast-payment', (req, res) => {
  const { amount, item_name } = req.body;

  const payfastData = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
    notify_url: 'http://localhost:3000/notify',
    item_name,
    amount: parseFloat(amount).toFixed(2),
  };

  // Generate signature
  const dataWithPassphrase = { ...payfastData, passphrase: PASSPHRASE };
  let signatureString = '';
  Object.keys(dataWithPassphrase).sort().forEach((key) => {
    if (dataWithPassphrase[key] !== undefined && dataWithPassphrase[key] !== '') {
      signatureString += `${key}=${encodeURIComponent(dataWithPassphrase[key]).replace(/%20/g, '+')}&`;
    }
  });
  signatureString = signatureString.slice(0, -1); // Remove trailing '&'
  const signature = crypto.createHash('md5').update(signatureString).digest('hex');

  // Construct URL
  const payfastUrl = 'https://www.payfast.co.za/eng/process?' + new URLSearchParams({
    ...payfastData,
    signature,
  }).toString();

  res.json({ paymentUrl: payfastUrl });
});

// 2. Endpoint to send SMS (using Twilio)
app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;

  const accountSid = 'AC031642049dd74fcc581b0fd106936a4f';
  const authToken = '1447e415a2fc483bd2bfbea57451d55d';
  const client = twilio(accountSid, authToken);

  try {
    const messageInstance = await client.messages.create({
      body: message,
      from: '+1234567890', // your Twilio number
      to,
    });
    res.json({ success: true, sid: messageInstance.sid });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: error.message });
  }
});

// 3. Endpoint to send Email (using Nodemailer)
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    auth: {
      user: 'your_email@example.com',
      pass: 'your_email_password',
    },
  });

  try {
    await transporter.sendMail({
      from: '"Your App" <no-reply@yourdomain.com>',
      to,
      subject,
      text,
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: error.message });
  }
});

// 4. Optional notifications endpoint
app.post('/notifications', (req, res) => {
  // Handle incoming notifications if needed
  res.json({ message: 'Notification received' });
});

// PayFast Payment Processing
app.post('/process-payment', (req, res) => {
  const { item_name, amount, name_first, name_last, email_address } = req.body;

  const payfastData = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
    notify_url: 'http://localhost:3000/notify',
    name_first,
    name_last,
    email_address,
    amount: parseFloat(amount).toFixed(2),
    item_name,
  };

  // Generate signature
  const dataWithPassphrase = { ...payfastData, passphrase: PASSPHRASE };
  let signatureString = '';
  Object.keys(dataWithPassphrase).sort().forEach((key) => {
    if (dataWithPassphrase[key] !== undefined && dataWithPassphrase[key] !== '') {
      signatureString += `${key}=${encodeURIComponent(dataWithPassphrase[key]).replace(/%20/g, '+')}&`;
    }
  });
  signatureString = signatureString.slice(0, -1);
  const signature = crypto.createHash('md5').update(signatureString).digest('hex');

  const payfastUrl = 'https://www.payfast.co.za/eng/process?' + new URLSearchParams({
    ...payfastData,
    signature,
  }).toString();

  res.json({ success: true, redirectUrl: payfastUrl });
});

// Success, cancel, notify routes
app.get('/success', (req, res) => {
  res.send('Payment successful!');
});

app.get('/cancel', (req, res) => {
  res.send('Payment cancelled.');
});

app.post('/notify', (req, res) => {
  console.log('ITN received:', req.body);
  res.status(200).send('ITN received');
});

// Catch-all route for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});