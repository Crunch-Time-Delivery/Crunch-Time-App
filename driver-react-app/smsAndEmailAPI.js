const express = require("express");
const twilio = require("twilio");
const path = require("path");

// Load environment variables (consider using 'dotenv' for local dev)
// For production, securely store these credentials
const accountSid = 'AC031642049dd74fcc581b0fd106936a4f';
const authToken = '1447e415a2fc483bd2bfbea57451d55d';
const twilioPhoneNumber = '+27795349327';
const express = require('express');
const path = require('path');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Send a single SMS message
 */
app.post('/send-notification', async (req, res) => {
  const { to, body } = req.body;
  if (!to || !body) {
    return res.status(400).json({ success: false, message: "Missing 'to' or 'body'" });
  }
  try {
    const message = await client.messages.create({ body, to, from: twilioPhoneNumber });
    console.log(`Message SID: ${message.sid}`);
    res.json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Send multiple SMS concurrently
 */
app.post('/send-multiple', async (req, res) => {
  const { messages } = req.body; // array of { to, body }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid 'messages' array." });
  }
  try {
    const results = await Promise.all(
      messages.map(({ to, body }) => client.messages.create({ to, body, from: twilioPhoneNumber }))
    );
    const sids = results.map(msg => msg.sid);
    res.json({ success: true, messageSids: sids });
  } catch (err) {
    console.error('Error sending messages:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Schedule message to be sent after delay (in seconds)
 * Note: For production, consider a job queue or scheduled task system
 */
app.post('/schedule-message', (req, res) => {
  const { to, body, delaySeconds } = req.body;
  if (!to || !body || typeof delaySeconds !== 'number') {
    return res.status(400).json({ success: false, message: "Missing or invalid parameters." });
  }
  setTimeout(async () => {
    try {
      const msg = await client.messages.create({ body, to, from: twilioPhoneNumber });
      console.log(`Scheduled message sent. SID: ${msg.sid}`);
      // Optionally, store info for future cancellation or tracking
    } catch (err) {
      console.error('Error sending scheduled message:', err);
    }
  }, delaySeconds * 1000);
  res.json({ success: true, message: `Message scheduled in ${delaySeconds} seconds.` });
});

/**
 * Get message status by SID
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
 * Bulk send with concurrency control (limit to 5 concurrent messages)
 */
app.post('/send-bulk', async (req, res) => {
  const { messages } = req.body; // array of { to, body }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid 'messages' array." });
  }
  const maxConcurrency = 5;
  const results = [];
  for (let i = 0; i < messages.length; i += maxConcurrency) {
    const chunk = messages.slice(i, i + maxConcurrency);
    try {
      const sentMessages = await Promise.all(
        chunk.map(({ to, body }) => client.messages.create({ to, body, from: twilioPhoneNumber }))
      );
      results.push(...sentMessages);
    } catch (err) {
      console.error('Error in bulk send:', err);
      // Optional: implement retries or partial success logic
    }
  }
  const sids = results.map(m => m.sid);
  res.json({ success: true, messageSids: sids });
});

/**
 * (Optional) Cancel scheduled message - placeholder
 * Note: Twilio does not support cancel after sending. You need to implement your own scheduling/cancellation.
 */
app.post('/cancel-scheduled', (req, res) => {
  // Your custom logic to cancel scheduled messages if stored in DB
  res.json({ success: false, message: 'Cancellation not implemented.' });
});

/**
 * Send templated message
 */
app.post('/send-template', (req, res) => {
  const { to, templateId, variables } = req.body;
  const templates = {
    welcome: 'Hello {name}, welcome to our service!',
    reminder: 'Hi {name}, your appointment is on {date}.'
  };
  const template = templates[templateId];
  if (!template) {
    return res.status(400).json({ success: false, message: 'Invalid template ID.' });
  }
  let messageBody = template;
  for (const key in variables) {
    messageBody = messageBody.replace(`{${key}}`, variables[key]);
  }
  client.messages
    .create({ to, body: messageBody, from: twilioPhoneNumber })
    .then(msg => res.json({ success: true, messageSid: msg.sid }))
    .catch(err => {
      console.error('Error sending template message:', err);
      res.status(500).json({ success: false, error: err.message });
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});