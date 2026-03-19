// config.js
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3001,
  payfast: {
    // Add your PayFast credentials if needed
  },
  twilio: {
    accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
    authToken: 'YOUR_TWILIO_AUTH_TOKEN',
    phoneNumber: 'YOUR_TWILIO_PHONE_NUMBER',
  },
  email: {
    user: 'your.email@gmail.com',
    pass: 'your-email-password-or-app-password',
  },
  staticDir: path.join(__dirname, 'build'),
};