// server.js (or your main server-side file)
const twilio = require('twilio'); // Import the Twilio Node.js helper library
require('dotenv').config(); // Load environment variables from .env file

// Twilio credentials from environment variables for security
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC031642049dd74fcc581b0fd106936a4f';
const authToken = process.env.TWILIO_AUTH_TOKEN || '1447e415a2fc483bd2bfbea57451d55d';
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER || '+27795349327'; // Admin phone number

const client = new twilio(accountSid, authToken);

// Function to send an SMS notification to the admin
async function sendAdminNotification(newUserName) {
    try {
        const message = await client.messages.create({
            to: adminPhoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER || '+27795349327', // Your Twilio phone number
            body: `New user logged in: ${newUserName}` // Message content
        });
        console.log(`Notification sent to admin. Message SID: ${message.sid}`);
    } catch (error) {
        console.error('Error sending admin notification:', error);
    }
}

// Function to handle user login event
function handleUserLogin(user) {
    // Log login event
    console.log(`User logged in: ${user.username}`);

    // Send notification if the user is new
    if (user.isNewUser) {
        sendAdminNotification(user.username);
    }

    // Additional logic can be added here (e.g., updating last login time)
}

// Function to notify user of specific events (e.g., order updates)
async function sendUserNotification(userPhoneNumber, messageBody) {
    try {
        const message = await client.messages.create({
            to: userPhoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER || '+27795349327',
            body: messageBody
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
    sendAdminNotification
};