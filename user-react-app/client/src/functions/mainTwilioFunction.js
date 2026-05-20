// Load Twilio runtime types (optional for type safety)
require('@twilio-labs/serverless-runtime-types');

exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();

  const to = event.to;
  const from = context.TWILIO_PHONE_NUMBER;
  const body = event.body || 'Hello from Twilio!';

  // Validate required environment variable
  if (!from) {
    return callback(new Error('TWILIO_PHONE_NUMBER environment variable is not set.'));
  }

  // Validate input
  if (!to) {
    return callback(new Error('Missing "to" parameter in event.'));
  }

  try {
    const messageSid = await client.messages.create({
      to,
      from,
      body,
    });
    callback(null, { success: true, sid: messageSid.sid });
  } catch (err) {
    console.error('Error sending message:', err);
    callback(err);
  }
};