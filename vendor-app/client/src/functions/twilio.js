const twilio = require('twilio');

const accountSid = '';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';

const client = twilio(accountSid, authToken);

async function sendSMS(to, message) {
  try {
    const messageInstance = await client.messages.create({
      body: message,
      from: 'YOUR_TWILIO_PHONE_NUMBER',
      to: to
    });
    return messageInstance;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

module.exports = { sendSMS };