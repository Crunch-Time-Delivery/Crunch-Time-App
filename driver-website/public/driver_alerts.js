// Import the required Twilio library
const twilio = require('twilio');

// Twilio credentials from Twilio Console
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

/**
 * Sends a driver alert via SMS
 * @param {string} driverPhoneNumber - Driver phone number (E.164 format)
 * @param {string} messageBody - The alert message text
 */
function sendDriverAlert(driverPhoneNumber, messageBody) {
    client.messages
        .create({
            body: `DRIVER ALERT: ${messageBody}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: driverPhoneNumber,
        })
        .then((message) => {
            console.log(`Driver alert sent: ${message.sid}`);
        })
        .catch((error) => {
            console.error(`Failed to send driver alert: ${error.message}`);
        });
}

/**
 * Sends a customer notification via SMS
 * @param {string} customerPhoneNumber - Customer phone number (E.164 format)
 * @param {string} messageBody - The notification message text
 */
function sendCustomerNotification(customerPhoneNumber, messageBody) {
    client.messages
        .create({
            body: `Notification: ${messageBody}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: customerPhoneNumber,
        })
        .then((message) => {
            console.log(`Customer notification sent: ${message.sid}`);
        })
        .catch((error) => {
            console.error(`Failed to send customer notification: ${error.message}`);
        });
}

/**
 * Sends a delivery status update
 * @param {string} recipientPhoneNumber - Recipient phone number (E.164 format)
 * @param {string} deliveryStatus - Status message (e.g., 'Delivered', 'In Transit')
 */
function sendDeliveryStatusUpdate(recipientPhoneNumber, deliveryStatus) {
    const messageBody = `Your delivery status: ${deliveryStatus}`;
    client.messages
        .create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: recipientPhoneNumber,
        })
        .then((message) => {
            console.log(`Delivery status update sent: ${message.sid}`);
        })
        .catch((error) => {
            console.error(`Failed to send delivery status: ${error.message}`);
        });
}

/**
 * Sends a group notification message to multiple recipients
 * @param {Array<string>} phoneNumbers - Array of phone numbers (E.164 format)
 * @param {string} messageBody - The message text
 */


// Example usage:
// sendDriverAlert('+15551234567', 'New delivery assignment available.');
// sendCustomerNotification('+15557654321', 'Your order has been shipped.');
// sendDeliveryStatusUpdate('+15551234567', 'Delivered successfully.');
// sendGroupNotification(['+15551234567', '+15557654321'], 'Emergency alert: Please check your app for updates.');