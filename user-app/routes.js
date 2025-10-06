// routes.js
const express = require('express');
const twilio = require('twilio');
const nodemailer = require('nodemailer');

module.exports = (app, config) => {
  const router = express.Router();

  // Setup Twilio client
  const twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);

  // Setup Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  // Send SMS route
  router.post('/send-sms', (req, res) => {
    const { to, message } = req.body;
    twilioClient.messages
      .create({
        body: message,
        from: config.twilio.phoneNumber,
        to: to,
      })
      .then((msg) => res.json({ success: true, sid: msg.sid }))
      .catch((err) => res.status(500).json({ success: false, error: err.message }));
  });

  // Send Email route
  router.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;
    const mailOptions = {
      from: config.email.user,
      to,
      subject,
      text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      res.json({ success: true, info: info.response });
    });
  });

  app.use('/api', router);
};