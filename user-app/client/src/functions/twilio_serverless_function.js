// Import the Twilio library if needed
// In Twilio serverless environment, Twilio is provided globally

exports.handler = function(context, event, callback) {
  const client = context.TWILIO_CLIENT; // Or use require('twilio')(accountSid, authToken) if outside Twilio runtime

  // Extract recipient number and message from event
  const to = event.to; // Phone number to send SMS
  const message = event.message; // Message content

  // Send SMS using Twilio
  client.messages
    .create({
      body: message,
      from: context.TWILIO_PHONE_NUMBER, // Your Twilio number
      to: to
    })
    .then((message) => {
      callback(null, { success: true, sid: message.sid });
    })
    .catch((error) => {
      callback(error);
    });
};
