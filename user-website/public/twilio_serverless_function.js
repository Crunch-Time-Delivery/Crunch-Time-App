// In Twilio serverless environment, Twilio is provided as 'Twilio'
// If outside, you'd instantiate with require('twilio')(accountSid, authToken)

exports.handler = async (context, event, callback) => {
  const client = context.TWILIO_CLIENT;

  // Extract parameters
  const to = event.to;
  const message = event.message;

  // Validate required parameters
  if (!to) {
    return callback(new Error('Missing "to" phone number in event.'));
  }
  if (!message) {
    return callback(new Error('Missing "message" content in event.'));
  }

  // Validate environment variable
  const fromNumber = context.TWILIO_PHONE_NUMBER;
  if (!fromNumber) {
    return callback(new Error('TWILIO_PHONE_NUMBER environment variable is not set.'));
  }

  try {
    const sentMessage = await client.messages.create({
      body: message,
      from: fromNumber,
      to,
    });
    // Return success with message SID
    callback(null, { success: true, sid: sentMessage.sid });
  } catch (err) {
    console.error('Error sending SMS:', err);
    callback(err);
  }
};