// server.js (or your main server-side file)
const twilio = require('twilio'); // Import the Twilio Node.js helper library

// Load environment variables for security (e.g., using 'dotenv')
require('dotenv').config(); 

// Find your Account SID and Auth Token at twilio.com/console
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid, authToken);

// Function to send an SMS notification
async function sendAdminNotification(newUserName) {
    try {
        const message = await client.messages.create({
            to: process.env.ADMIN_PHONE_NUMBER, // Admin's phone number (e.g., from environment variables)
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
            body: `New user logged in: ${newUserName}` // Message content
        });
        console.log(`Notification sent to admin. Message SID: ${message.sid}`);
    } catch (error) {
        console.error('Error sending admin notification:', error);
    }
}

// Example of how you would call this function after a successful user login
// This would typically be within your user authentication logic
function handleUserLogin(user) {
    // ... your login logic ...

    if (user.isNewUser) { // Assuming you have a way to determine if it's a new user
        sendAdminNotification(user.username);
    }

    
}

// In a real application, you would integrate `handleUserLogin`
// with your authentication routes or middleware.
// For demonstration:
// handleUserLogin({ username: 'JohnDoe', isNewUser: true }); 