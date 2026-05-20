const AWS = require('aws-sdk');

// Configure AWS region if needed
AWS.config.update({ region: 'us-east-1' }); // change to your region

const sns = new AWS.SNS();

/**
 * Send an SMS message via AWS SNS.
 * @param {string} phoneNumber - The recipient's phone number in E.164 format (e.g., +1234567890).
 * @param {string} message - The message to send.
 * @returns {Promise<void>}
 */
async function sendSMS(phoneNumber, message) {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    throw new Error('Invalid phoneNumber.');
  }

  if (!message || typeof message !== 'string') {
    throw new Error('Invalid message.');
  }

  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
  };

  try {
    const result = await sns.publish(params).promise();
    console.log('SMS sent successfully:', result);
  } catch (err) {
    console.error('Error sending SMS:', err);
    throw err; // Propagate error for caller handling
  }
}

// Export the function for external use
module.exports = { sendSMS };

// Usage example (uncomment to test):
// const phoneNumber = '+1234567890'; // replace with actual number
// const message = 'Your order is arriving soon!';
// sendSMS(phoneNumber, message).catch(console.error);