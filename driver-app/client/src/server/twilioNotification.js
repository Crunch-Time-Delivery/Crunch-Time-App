// Import Twilio SDK

const twilio = require('twilio');

// Initialize Twilio client with your credentials (set as environment variables)

const accountSid = 'ACe600915fdef6b7f3fe3cc2f7c0c5e4d3' ;
const authToken = '6ecf4956b166ae86f2c62ad0f1051dd7 ' ;
const client = twilio(accountSid, authToken);

/**
 * Send SMS via Twilio
 * @param {string} to - The recipient phone number
 * @param {string} message - The message body
 * @returns {Promise} - Promise resolving to message info
 */

function sendSms(to, message) {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
    to: to,
  });
}

module.exports = { sendSms };