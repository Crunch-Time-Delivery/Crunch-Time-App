const express = require("express");
const twilio = require("twilio");
const path = require("path");
require('dotenv').config(); // Load env variables from .env file

// Use environment variables for credentials
const accountSid = 'AC031642049dd74fcc581b0fd106936a4f';
const authToken = '1447e415a2fc483bd2bfbea57451d55d';
const twilioPhoneNumber = '+27795349327';
const express = require('express');
const path = require('path');
const twilio = require('twilio');

require('dotenv').config(); // Load environment variables

const express = require('express');
const path = require('path');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

// Validate essential environment variables
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  console.error('Twilio environment variables are missing. Please set them in your .env file.');
  process.exit(1);
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Send a single SMS message
 */
app.post('/send-notification', async (req, res) => {
  const { to, body } = req.body;
  if (!to || !body) {
    return res.status(400).json({ success: false, message: "Missing 'to' or 'body' parameter." });
  }
  try {
    const message = await client.messages.create({ body, to, from: TWILIO_PHONE_NUMBER });
    console.log(`Sent message SID: ${message.sid}`);
    res.json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Send multiple messages concurrently with controlled concurrency
 */
app.post('/send-multiple', async (req, res) => {
  const { messages } = req.body; // Expecting [{ to, body }, ...]
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid 'messages' array." });
  }

  const maxConcurrency = 5; // Limit concurrent sends
  const results = [];
  for (let i = 0; i < messages.length; i += maxConcurrency) {
    const chunk = messages.slice(i, i + maxConcurrency);
    const promises = chunk.map(({ to, body }) => client.messages.create({ to, body, from: TWILIO_PHONE_NUMBER }));
    try {
      const sentMessages = await Promise.all(promises);
      results.push(...sentMessages);
    } catch (err) {
      console.error('Error in bulk message:', err);
      // Optionally handle retries or partial success
    }
  }
  const sids = results.map(m => m.sid);
  res.json({ success: true, messageSids: sids });
});

/**
 * Schedule a message after a delay (simple implementation)
 * Note: For production, consider a job queue or persistent storage
 */
app.post('/schedule-message', (req, res) => {
  const { to, body, delaySeconds } = req.body;
  if (!to || !body || typeof delaySeconds !== 'number') {
    return res.status(400).json({ success: false, message: 'Missing or invalid parameters.' });
  }
  setTimeout(async () => {
    try {
      const message = await client.messages.create({ body, to, from: TWILIO_PHONE_NUMBER });
      console.log(`Scheduled message sent. SID: ${message.sid}`);
      // Optional: store info for tracking/cancellation
    } catch (err) {
      console.error('Error sending scheduled message:', err);
    }
  }, delaySeconds * 1000);
  res.json({ success: true, message: `Message scheduled in ${delaySeconds} seconds.` });
});

/**
 * Fetch message status by SID
 */
app.get('/message-status/:sid', async (req, res) => {
  const { sid } = req.params;
  try {
    const message = await client.messages(sid).fetch();
    res.json({ success: true, status: message.status, messageSid: message.sid });
  } catch (error) {
    console.error('Error fetching message status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Bulk send messages with concurrency control
 */
app.post('/send-bulk', async (req, res) => {
  const { messages } = req.body; // [{ to, body }, ...]
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid 'messages' array." });
  }

  const maxConcurrency = 5;
  const results = [];
  for (let i = 0; i < messages.length; i += maxConcurrency) {
    const chunk = messages.slice(i, i + maxConcurrency);
    const promises = chunk.map(({ to, body }) => client.messages.create({ to, body, from: TWILIO_PHONE_NUMBER }));
    try {
      const sentMessages = await Promise.all(promises);
      results.push(...sentMessages);
    } catch (err) {
      console.error('Error in bulk message:', err);
      // Optional: handle retries or partial success
    }
  }
  const sids = results.map(m => m.sid);
  res.json({ success: true, messageSids: sids });
});

/**
 * Placeholder for canceling scheduled messages (not supported directly)
 */
app.post('/cancel-scheduled', (req, res) => {
  // Implement your own scheduling system with persistent storage if needed
  res.json({ success: false, message: 'Cancellation not supported in this demo.' });
});

/**
 * Send templated messages
 */
app.post('/send-template', async (req, res) => {
  const { to, templateId, variables } = req.body;
  const templates = {
    welcome: 'Hello {name}, welcome to our service!',
    reminder: 'Hi {name}, your appointment is on {date}.',
  };
  const template = templates[templateId];
  if (!template) {
    return res.status(400).json({ success: false, message: 'Invalid template ID.' });
  }
  let messageBody = template;
  for (const key in variables) {
    messageBody = messageBody.replace(`{${key}}`, variables[key]);
  }
  try {
    const msg = await client.messages.create({ to, body: messageBody, from: TWILIO_PHONE_NUMBER });
    res.json({ success: true, messageSid: msg.sid });
  } catch (err) {
    console.error('Error sending template message:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});