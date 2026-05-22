// server.js (or your main server-side file)
const twilio = require('twilio'); // Import the Twilio Node.js helper library
require('dotenv').config(); // Load environment variables from .env file

// Twilio credentials from environment variables for security
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC031642049dd74fcc581b0fd106936a4f';
const authToken = process.env.TWILIO_AUTH_TOKEN || '1447e415a2fc483bd2bfbea57451d55d';
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER || '+27795349327'; // Admin phone number
// Import Twilio SDK
const twilio = require('twilio');

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;
const fromNumber = process.env.TWILIO_PHONE_NUMBER || '+27795349327';

// Validate essential environment variables
if (!accountSid || !authToken || !adminPhoneNumber) {
  throw new Error('Missing essential environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or ADMIN_PHONE_NUMBER.');
}

// Initialize Twilio client
const client = twilio(accountSid, authToken);

/**
 * Sends an SMS notification to the admin about a new user login.
 * @param {string} newUserName - The username of the new user.
 */
async function sendAdminNotification(newUserName) {
  if (!newUserName) {
    console.warn('sendAdminNotification called with empty username.');
    return;
  }
  try {
    const message = await client.messages.create({
      to: adminPhoneNumber,
      from: fromNumber,
      body: `New user logged in: ${newUserName}`,
    });
    console.log(`Notification sent to admin. Message SID: ${message.sid}`);
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

/**
 * Handles user login event, logs the event, and notifies admin if new user.
 * @param {Object} user - User object with username and isNewUser flag.
 */
function handleUserLogin(user) {
  if (!user || !user.username) {
    console.warn('handleUserLogin called with invalid user object.');
    return;
  }
  console.log(`User logged in: ${user.username}`);
  if (user.isNewUser) {
    sendAdminNotification(user.username);
  }
  // Additional login logic can go here
}

/**
 * Sends a notification message to a specific user.
 * @param {string} userPhoneNumber - The recipient's phone number.
 * @param {string} messageBody - The message content.
 */
async function sendUserNotification(userPhoneNumber, messageBody) {
  if (!userPhoneNumber || !messageBody) {
    console.warn('sendUserNotification called with missing parameters.');
    return;
  }
  try {
    const message = await client.messages.create({
      to: userPhoneNumber,
      from: fromNumber,
      body: messageBody,
    });
    console.log(`Notification sent to user. Message SID: ${message.sid}`);
  } catch (error) {
    console.error('Error sending user notification:', error);
  }
}

module.exports = {
  handleUserLogin,
  sendUserNotification,
  sendAdminNotification,
};