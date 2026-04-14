// lambda-handler.js

const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
  // Parse incoming event (e.g., API Gateway payload)
  const { deviceId, position, userId, message } = JSON.parse(event.body);

  // Optionally, process or store data here

  // Send notification via SNS
  const params = {
    Message: message || `Device ${deviceId} moved to position ${position}`,
    PhoneNumber: '+1234567890', // replace with your recipient's phone number
    // Or use TopicArn for SNS topic
  };

  try {
    const snsResult = await sns.publish(params).promise();
    console.log('SNS message sent:', snsResult);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent', snsMessageId: snsResult.MessageId }),
    };
  } catch (error) {
    console.error('Error sending SNS message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send notification' }),
    };
  }
};
