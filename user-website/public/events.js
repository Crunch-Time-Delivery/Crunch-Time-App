// events.js - Lambda function to process AWS events (SNS, SQS, etc.)
exports.handler = async (event) => {
  // Log the entire event for debugging
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Process each record (for SNS, SQS, etc.)
  if (event.Records) {
    for (const record of event.Records) {
      // Example: handle SNS message
      if (record.Sns) {
        const message = record.Sns.Message;
        console.log('SNS Message:', message);
        // Add your processing logic here
      }
      // Add handling for other event types if needed
    }
  }

  // Return success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Event processed' }),
  };
};