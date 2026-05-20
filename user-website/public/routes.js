const express = require('express');

module.exports = (app, config) => {
  const router = express.Router();

  // Initialize Twilio client
  const twilioClient = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

  // Setup Nodemailer transporter
  const transporter = require('nodemailer').createTransport({
    service: 'Gmail',
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  // Validate request body middleware
  const validateRequestBody = (fields) => (req, res, next) => {
    for (const field of fields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, error: `Missing field: ${field}` });
      }
    }
    next();
  };

  // Send SMS route
  router.post('/send-sms', validateRequestBody(['to', 'message']), async (req, res) => {
    const { to, message } = req.body;
    try {
      const msg = await twilioClient.messages.create({
        body: message,
        from: config.twilio.phoneNumber,
        to,
      });
      res.json({ success: true, sid: msg.sid });
    } catch (err) {
      console.error('Error sending SMS:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Send Email route
  router.post('/send-email', validateRequestBody(['to', 'subject', 'text']), (req, res) => {
    const { to, subject, text } = req.body;
    const mailOptions = {
      from: config.email.user,
      to,
      subject,
      text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
      res.json({ success: true, info: info.response });
    });
  });

  // Mount router at /api
  app.use('/api', router);
};