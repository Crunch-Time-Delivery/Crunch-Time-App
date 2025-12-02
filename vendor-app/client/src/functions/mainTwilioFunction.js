// Load Twilio runtime types (optional for type safety, but included for completeness)
require('@twilio-labs/serverless-runtime-types');

exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();

  // Example: Respond to an event or handle logic here
  // For example, sending an SMS, making a call, or returning info

  try {
    // Example: Send an SMS (modify as needed)
    const messageSid = await client.messages.create({
      to: event.to || '+27795349327', // default or from event
      from: context.TWILIO_PHONE_NUMBER, // set in env vars
      body: event.body || 'Hello from Twilio!',
    });

    callback(null, { success: true, sid: messageSid.sid });
  } catch (err) {
    callback(err);
  }
};
