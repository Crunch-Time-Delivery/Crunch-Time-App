// Lambda function to send SMS via SNS
const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { phoneNumber, message } = body;

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