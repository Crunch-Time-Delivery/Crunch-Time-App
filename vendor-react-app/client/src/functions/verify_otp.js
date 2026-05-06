// index.js (Node.js/Express backend)
const express = require('express');
const twilio = require('twilio');
const app = express();
app.use(express.json());

// Load environment variables securely
const accountSid = "AC031642049dd74fcc581b0fd106936a4f";
const authToken = "447e415a2fc483bd2bfbea57451d55d";
const verifyServiceSid = process.env.TWILIO_SERVICE_SID; 

const client = twilio(accountSid, authToken);

// Endpoint to send the OTP
app.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  // Validate phoneNumber presence and format
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return res.status(400).send({ success: false, message: 'Invalid or missing phoneNumber' });
  }

  try {
    // Send verification via Twilio Verify Service
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });

    // Respond with success and verification SID
    res.status(200).send({ success: true, sid: verification.sid });
  } catch (error) {
    // Log error details for debugging
    console.error('Error sending OTP:', error);

    // Respond with error message
    res.status(500).send({ success: false, error: error.message });
  }
});