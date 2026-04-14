// sns-notification.js

const AWS = require('aws-sdk');
const sns = new AWS.SNS();

async function sendSMS(phoneNumber, message) {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber, // E.164 format e.g., +1234567890
  };

  try {
    const result = await sns.publish(params).promise();
    console.log('SMS sent:', result);
  } catch (err) {
    console.error('Error sending SMS:', err);
  }
}

// Usage example:
const phoneNumber = '+1234567890'; // replace with actual number
const message = 'Your order is arriving soon!';

sendSMS(phoneNumber, message);
