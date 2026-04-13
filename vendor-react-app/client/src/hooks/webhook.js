// webhook.js - Lambda function to process webhook requests
exports.handler = async (event) => {
  // Parse the request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    console.error('Invalid JSON:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  // Process the webhook data
  console.log('Webhook payload:', body);

  // Example: Save to DynamoDB, trigger other services, etc.
  // For now, just respond with a success message
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Webhook received', data: body }),
  };
};