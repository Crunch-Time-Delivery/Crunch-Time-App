const twilio = require('twilio');
const accountSid = 'AC031642049dd74fcc581b0fd106936a4f';
const authToken = '1447e415a2fc483bd2bfbea57451d55d';

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