const express = require('express');
const AWS = require('aws-sdk');
const twilio = require('twilio');
const path = require('path');

const snsRegion = process.env.AWS_REGION || 'us-east-1';
const port = process.env.PORT || 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(accountSid, authToken);
const sns = new AWS.SNS({ region: snsRegion });

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --------------------- Send Single SMS via Twilio ---------------------
app.post('/send-notification', async (req, res) => {
  const { to, body } = req.body;
  if (!to || !body) {
    return res.status(400).json({ success: false, message: "Missing 'to' or 'body'" });
  }
  try {
    const message = await twilioClient.messages.create({ body, to, from: twilioPhoneNumber });
    console.log(`Twilio message SID: ${message.sid}`);
    res.json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --------------------- Send Multiple SMS messages ---------------------
app.post('/send-multiple', async (req, res) => {
  const { messages } = req.body; // [{ to, body }, ...]
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid 'messages' array." });
  }
  try {
    const results = await Promise.all(
      messages.map(({ to, body }) =>
        twilioClient.messages.create({ to, body, from: twilioPhoneNumber })
      )
    );
    const sids = results.map(m => m.sid);
    res.json({ success: true, messageSids: sids });
  } catch (err) {
    console.error('Error sending messages:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --------------------- Schedule message with delay ---------------------
app.post('/schedule-message', (req, res) => {
  const { to, body, delaySeconds } = req.body;
  if (!to || !body || typeof delaySeconds !== 'number') {
    return res.status(400).json({ success: false, message: "Missing or invalid parameters." });
  }
  setTimeout(async () => {
    try {
      const message = await twilioClient.messages.create({ body, to, from: twilioPhoneNumber });
      console.log(`Scheduled message sent. SID: ${message.sid}`);
    } catch (err) {
      console.error('Error sending scheduled message:', err);
    }
  }, delaySeconds * 1000);
  res.json({ success: true, message: `Message scheduled in ${delaySeconds} seconds.` });
});

// --------------------- Get message status ---------------------
app.get('/message-status/:sid', async (req, res) => {
  const { sid } = req.params;
  try {
    const message = await twilioClient.messages(sid).fetch();
    res.json({ success: true, status: message.status, messageSid: message.sid });
  } catch (error) {
    console.error('Error fetching message status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --------------------- Bulk send with concurrency limit ---------------------
app.post('/send-bulk', async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid 'messages' array." });
  }
  const maxConcurrency = 5;
  const results = [];
  for (let i = 0; i < messages.length; i += maxConcurrency) {
    const chunk = messages.slice(i, i + maxConcurrency);
    try {
      const sentMessages = await Promise.all(
        chunk.map(({ to, body }) =>
          twilioClient.messages.create({ to, body, from: twilioPhoneNumber })
        )
      );
      results.push(...sentMessages);
    } catch (err) {
      console.error('Error in bulk send:', err);
      // Optional: implement retries here
    }
  }
  const sids = results.map(m => m.sid);
  res.json({ success: true, messageSids: sids });
});

// --------------------- Send SMS via SNS ---------------------
async function sendSNS(phoneNumber, message) {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber, // E.164 format
  };
  try {
    const result = await sns.publish(params).promise();
    console.log('SNS message sent:', result);
    return result;
  } catch (err) {
    console.error('Error sending SNS message:', err);
    throw err;
  }
}

app.post('/send-sns', async (req, res) => {
  const { phoneNumber, message } = req.body;
  if (!phoneNumber || !message) {
    return res.status(400).json({ success: false, message: "Missing 'phoneNumber' or 'message'" });
  }
  try {
    const result = await sendSNS(phoneNumber, message);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --------------------- Start server ---------------------
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
