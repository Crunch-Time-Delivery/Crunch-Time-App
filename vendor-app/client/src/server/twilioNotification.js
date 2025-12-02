// Import Twilio SDK

const twilio = require('twilio');

// Initialize Twilio client with your credentials (set as environment variables)

const accountSid =  AC031642049dd74fcc581b0fd106936a4f;
const authToken = "1447e415a2fc483bd2bfbea57451d55d";
const client = twilio(accountSid, authToken);

/*** Send SMS via Twilio
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