// config.js
module.exports = {
  port: process.env.PORT ||  5501,
  twilio: {

    accountSid: 'AC031642049dd74fcc581b0fd106936a4f   ',
    authToken: '447e415a2fc483bd2bfbea57451d55d   ',
    phoneNumber: '+27795349327   ',

  },
  email: {
    user: 'your.email@gmail.com',
    pass: 'your-email-password-or-app-password',
  },
  // For serving static files (React build)
  staticDir: path.join(__dirname, 'build'),
};