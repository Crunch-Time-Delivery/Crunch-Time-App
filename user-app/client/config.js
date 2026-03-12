// config.js
module.exports = {
  port: process.env.PORT || 3001,
  twilio: {
    accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
    authToken: 'YOUR_TWILIO_AUTH_TOKEN',
    phoneNumber: 'YOUR_TWILIO_PHONE_NUMBER',
  },
  email: {
    user: 'your.email@gmail.com',
    pass: 'your-email-password-or-app-password',
  },
  // For serving static files (React build)
  staticDir: path.join(__dirname, 'build'),
};