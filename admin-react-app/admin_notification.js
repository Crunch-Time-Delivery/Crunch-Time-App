// server.js (or your main server-side file)
const twilio = require('twilio'); // Import the Twilio Node.js helper library
require('dotenv').config(); // Load environment variables from .env file

// Twilio credentials from environment variables for security
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC031642049dd74fcc581b0fd106936a4f';
const authToken = process.env.TWILIO_AUTH_TOKEN || '1447e415a2fc483bd2bfbea57451d55d';
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER || '+27795349327'; // Admin phone number

const client = new twilio(accountSid, authToken);
// Assuming you have the Twilio client initialized elsewhere
// Example: const client = require('twilio')(accountSid, authToken);

/**
 * Sends an SMS notification to the admin about a new user login.
 * @param {string} newUserName - The username of the new user.
 */
async function sendAdminNotification(newUserName) {
  try {
    const message = await client.messages.create({
      to: adminPhoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER || '+27795349327', // Your Twilio phone number
      body: `New user logged in: ${newUserName}`,
    });
    console.log(`Notification sent to admin. Message SID: ${message.sid}`);
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

/**
 * Handles user login event, logs the event, and notifies admin if new user.
 * @param {Object} user - User object containing username and isNewUser flag.
 */
function handleUserLogin(user) {
  // Log login event
  console.log(`User logged in: ${user.username}`);

  // Send notification if the user is new
  if (user.isNewUser) {
    sendAdminNotification(user.username);
  }

  // Additional logic can be added here (e.g., updating last login timestamp)
}

/**
 * Sends a notification message to a specific user.
 * @param {string} userPhoneNumber - The recipient's phone number.
 * @param {string} messageBody - The message content.
 */
async function sendUserNotification(userPhoneNumber, messageBody) {
  try {
    const message = await client.messages.create({
      to: userPhoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER || '+27795349327',
      body: messageBody,
    });
    console.log(`Notification sent to user. Message SID: ${message.sid}`);
  } catch (error) {
    console.error('Error sending user notification:', error);
  }
}

// Example usage:
// handleUserLogin({ username: 'JohnDoe', isNewUser: true });
// sendUserNotification('+27812345678', 'Your order has been shipped!');

module.exports = {
  handleUserLogin,
  sendUserNotification,
  sendAdminNotification,
};