const twilio = require('twilio');

const client = twilio(accountSid, authToken);

async function sendSMS(to, message) {
  try {
    const messageInstance = await client.messages.create({
      body: message,
      from: '+27795349327',
      to: to
    });
    return messageInstance;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

module.exports = { sendSMS };