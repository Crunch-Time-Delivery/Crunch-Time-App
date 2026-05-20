exports.handler = async (event) => {
  let body;

  // Parse the request body with error handling
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    console.error('Invalid JSON:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  // Log the received payload for debugging/monitoring
  console.log('Webhook payload:', body);

  // TODO: Add your processing logic here
  // e.g., save to DynamoDB, trigger other services, validate payload structure, etc.

  // Respond with success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Webhook received successfully', data: body }),
  };
};