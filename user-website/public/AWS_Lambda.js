import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Initialize SNS client with explicit configuration
const snsClient = new SNSClient({ region: 'your-region' }); // Replace 'your-region' with your AWS region

export const handler = async (event) => {
  try {
    // Parse request body
    const { phoneNumber, message } = JSON.parse(event.body || '{}');

    // Validate input
    if (!phoneNumber || !message) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required parameters: phoneNumber and message' }),
      };
    }

    // Optional: Validate phone number format (basic check)
    const phoneRegex = /^\+\d{1,15}$/; // E.164 format
    if (!phoneRegex.test(phoneNumber)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid phoneNumber format. Use E.164 format, e.g., +1234567890' }),
      };
    }

    // Send SMS via SNS
    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
    };

    const data = await snsClient.send(new PublishCommand(params));

    // Success response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: data.MessageId }),
    };
  } catch (err) {
    console.error('Error sending SMS:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Internal Server Error' }),
    };
  }
};