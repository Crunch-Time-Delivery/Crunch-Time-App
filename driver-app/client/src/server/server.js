// server.js
const express = require('express');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 1. Endpoint to create PayFast payment URL
app.post('/create-payfast-payment', (req, res) => {
  const { amount, item_name } = req.body;

  // Typically, you'd generate a secure payment URL with PayFast API
  // Here, we'll simulate by creating a dummy URL
  const paymentUrl = `https://sandbox.payfast.co.za/eng/process?amount=${amount}&item_name=${encodeURIComponent(item_name)}`;

  res.json({ paymentUrl });
});

// 2. Endpoint to send SMS (using Twilio as example)
app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;

  // Replace with your Twilio credentials
  const accountSid = ' AC031642049dd74fcc581b0fd106936a4f';
  const authToken = '1447e415a2fc483bd2bfbea57451d55d';
  const client = require('twilio')(accountSid, authToken);

  try {
    const messageInstance = await client.messages.create({
      body: message,
      from: '+1234567890', // your Twilio number
      to: to,
    });
    res.json({ success: true, sid: messageInstance.sid });
  } catch (error) {
    console.error(error);
     res.json({ success: false, error: error.message });
  }
});

// 3. Endpoint to send Email (using Nodemailer)
const nodemailer = require('nodemailer');

app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

   // Configure your SMTP transporter
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
// 4. (Optional) Endpoint to receive notifications (if you want to trigger server-side notifications)
app.post('/notifications', (req, res) => {
  // Handle incoming notifications if needed
  res.json({ message: 'Notification received' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});// 4. (Optional) Endpoint to receive notifications (if you want to trigger server-side notifications)
app.post('/notifications', (req, res) => {
  // Handle incoming notifications if needed
  res.json({ message: 'Notification received' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
app.use(express.static(path.join(__dirname, 'build')));

// API route example
app.get('/api/your-endpoint_main.jsx_driver_app', (req, res) => {
  res.json({ message: 'Hello from React backend!', timestamp: Date.now() });
});

// Fallback to serve index.html for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


// PayFast Sandbox credentials (replace with your live credentials for production)
const MERCHANT_ID = '10000100'; // Sandbox Merchant ID
const MERCHANT_KEY = '46f0cd694581a'; // Sandbox Merchant Key
const PASSPHRASE = 'itbVnL9z3d'; // Sandbox Passphrase

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files like index.html and script.js

app.post('/process-payment', (req, res) => {
    const { item_name, amount, name_first, name_last, email_address } = req.body;

    // Prepare PayFast data
    const payfastData = {
        merchant_id: MERCHANT_ID,
        merchant_key: MERCHANT_KEY,
        return_url: 'http://localhost:3000/success', // Your success URL
        cancel_url: 'http://localhost:3000/cancel', // Your cancel URL
        notify_url: 'http://localhost:3000/notify', // Your ITN URL
        name_first,
        name_last,
        email_address,
        amount: parseFloat(amount).toFixed(2), // Format amount correctly
        item_name,
        // Add other required fields like m_payment_id, item_description, etc.
    };

    // Add passphrase for signature generation
    const dataWithPassphrase = { ...payfastData, passphrase: PASSPHRASE };

    // Generate PayFast signature
    let signatureString = '';
    Object.keys(dataWithPassphrase).sort().forEach(key => {
        if (dataWithPassphrase[key] !== undefined && dataWithPassphrase[key] !== '') {
            signatureString += `${key}=${encodeURIComponent(dataWithPassphrase[key]).replace(/%20/g, '+')}&`;
        }
    });
    signatureString = signatureString.slice(0, -1); // Remove trailing '&'

    const signature = crypto.createHash('md5').update(signatureString).digest('hex');

    // Construct the PayFast redirect URL
    const payfastUrl = 'https://www.payfast.co.za/eng/process?' + new URLSearchParams({
        ...payfastData,
        signature: signature
    }).toString();

    res.json({ success: true, redirectUrl: payfastUrl });
});

// Example success, cancel, and notify routes
app.get('/success', (req, res) => {
    res.send('Payment successful!');
});

app.get('/cancel', (req, res) => {
    res.send('Payment cancelled.');
});

app.post('/notify', (req, res) => {
    // Implement PayFast ITN (Instant Transaction Notification) verification here
    console.log('ITN received:', req.body);
    res.status(200).send('ITN received');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});