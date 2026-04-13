// Lambda function to send SMS via SNS
const AWS = require('aws-sdk');

// Set AWS Region, replace with your region if needed
AWS.config.update({ region: 'us-east-1' });

const sns = new AWS.SNS();

exports.handler = async (event) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (parseErr) {
    console.error('Invalid JSON:', parseErr);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  const { phoneNumber, message } = body;

  // Basic validation
  if (!phoneNumber || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing phoneNumber or message' }),
    };
  }

  const params = {
    PhoneNumber: phoneNumber, // e.g., '+1234567890'
    Message: message,
  };

  try {
    const result = await sns.publish(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'SMS sent successfully',
        messageId: result.MessageId,
      }),
    };
  } catch (err) {
    console.error('Error sending SMS:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send SMS' }),
    };
  }
};