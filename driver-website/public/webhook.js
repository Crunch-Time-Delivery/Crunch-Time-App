// webhook.js - Lambda function to process webhook requests
exports.handler = async (event) => {
  let body;

  // Parse JSON body with error handling
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    console.error('Invalid JSON payload:', err);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  // Log the webhook payload for debugging
  console.log('Webhook payload:', body);

  // TODO: Add your processing logic here, e.g., save to DynamoDB, trigger workflows, etc.

  // Return success response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: 'Webhook received successfully', receivedData: body }),
  };
};