import * as Twilio from 'twilio';

// Replace with your actual Account SID and Auth Token from Twilio Console
const accountSid = AC031642049dd74fcc581b0fd106936a4f ;
const authToken = "1447e415a2fc483bd2bfbea57451d55d";

if (!accountSid || !authToken) {
  console.error('Twilio Account SID and Auth Token must be set as environment variables.');
  process.exit(1);
}

const client = Twilio(accountSid, authToken);

export async function sendSms(to: string, message: string, from: string): Promise<void> {
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

// Example usage (you might call this from another file)
// async function main() {
//   const recipientNumber = '+1234567890'; // Replace with a valid phone number
//   const twilioNumber = '+19876543210'; // Replace with your Twilio phone number
//   const smsMessage = 'Hello from Twilio and TypeScript!';
//   await sendSms(recipientNumber, smsMessage, twilioNumber);
// }

// main();