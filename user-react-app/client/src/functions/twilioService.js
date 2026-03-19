const Twilio = require('twilio');

// Hardcoded credentials (not recommended for production)
const accountSid = 'AC031642049dd74fcc581b0fd106936a4f';
const authToken = '1447e415a2fc483bd2bfbea57451d55d';

// If you prefer to use environment variables, comment out the above two lines and uncomment below:
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error('Twilio Account SID and Auth Token must be set.');
  process.exit(1);
}

// Initialize Twilio client
const client = Twilio(accountSid, authToken);

/**
 * Sends an SMS message using Twilio.
 * @param {string} to - Recipient's phone number
 * @param {string} message - Message body
 * @param {string} from - Your Twilio phone number
 * @returns {Promise<void>}
 */
async function sendSms(to, message, from) {
  try {
    const messageResource = await client.messages.create({
      body: message,
      from: from, // Your Twilio phone number
      to: to,     // Recipient's phone number
    });
    console.log(`Message sent successfully! SID: ${messageResource.sid}`);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

// Export the function if using modules
module.exports = { sendSms };