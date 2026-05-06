import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Initialize SNS client with explicit region or configuration if needed
const snsClient = new SNSClient({ region: 'your-region' }); // Replace 'your-region' with your AWS region

export const handler = async (event) => {
  try {
    const { phoneNumber, message } = JSON.parse(event.body);

    // Basic validation
    if (!phoneNumber || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing phoneNumber or message' }),
      };
    }

    const params = {
      Message: message,
      PhoneNumber: phoneNumber, // Format: +1XXXXXXXXXX
    };

    const data = await snsClient.send(new PublishCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ messageId: data.MessageId }),
    };
  } catch (err) {
    console.error('Error sending SMS:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};