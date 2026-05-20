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
      body: JSON.stringify({ error: 'Invalid JSON payload' }),
    };
  }

  // Log the received payload for debugging and monitoring
  console.log('Webhook payload received:', body);

  // TODO: Implement your processing logic here
  // e.g., save to DynamoDB, trigger workflows, validate payload, etc.

  // Return success response with received data
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: 'Webhook received successfully', receivedData: body }),
  };
};