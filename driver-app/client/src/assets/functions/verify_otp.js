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
  try {
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' }); 

    res.status(200).send({ success: true, sid: verification.sid });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
});
