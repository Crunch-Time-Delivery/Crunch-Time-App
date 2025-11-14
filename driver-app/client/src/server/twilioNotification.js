// Import Twilio SDK

const twilio = require('twilio');

// Initialize Twilio client with your credentials (set as environment variables)

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
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