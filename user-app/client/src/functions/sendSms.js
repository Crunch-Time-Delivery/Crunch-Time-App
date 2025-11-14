// Import Twilio serverless runtime types (optional for type info, but keeping for consistency)
require('@twilio-labs/serverless-runtime-types');

exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();

  try {
    const message = await client.messages.create({
      to: event.to,
      from: context.TWILIO_PHONE_NUMBER, // ensure this env variable is set
      body: event.message,
    });
    callback(null, { success: true, sid: message.sid });
  } catch (error) {
    callback(error);
  }
};