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
  const accountSid = 'YOUR_TWILIO_SID';
  const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
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