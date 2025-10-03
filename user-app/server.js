// server.js
const express = require('express');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json());
const PORT = 3000;

// Twilio credentials
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = 'YOUR_TWILIO_PHONE_NUMBER';

// Nodemailer setup (using Gmail example)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your.email@gmail.com',
    pass: 'your-email-password-or-app-password',
  },
});

app.post('/send-sms', (req, res) => {
  const { to, message } = req.body;
  twilioClient.messages
    .create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    })
    .then((message) => {
      res.json({ success: true, sid: message.sid });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});

app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'your.email@gmail.com', // Your email
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ success: true, error: error.message });
    }
    res.json({ success: true, info: info.response });
  });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
app.use(express.static(path.join(__dirname, 'build')));

// API route example
app.get('/api/your-endpoint_main.jsx_user_app', (req, res) => {
  res.json({ message: 'Hello from React backend!', timestamp: Date.now() });
});

// Fallback to serve index.html for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});