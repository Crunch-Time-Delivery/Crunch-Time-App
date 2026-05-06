// Import the Twilio library
const twilio = require('twilio');

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);
/**
 * Validates phone numbers (basic check for E.164 format)
 * @param {string} phoneNumber
 * @returns {boolean}
 */
function isValidPhoneNumber(phoneNumber) {
  const e164Regex = /^\+?[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}

/**
 * Sends an SMS message via Twilio
 * @param {string} to - Recipient phone number
 * @param {string} message - Message content
 * @returns {Promise<void>}
 */
async function sendMessage(to, message) {
  if (!isValidPhoneNumber(to)) {
    console.error(`Invalid phone number: ${to}`);
    return;
  }
  if (!message || typeof message !== 'string') {
    console.error('Invalid message content.');
    return;
  }

  try {
    const msg = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });
    console.log(`Message sent to ${to}: SID ${msg.sid}`);
  } catch (error) {
    console.error(`Failed to send message to ${to}: ${error.message}`);
  }
}

/**
 * Sends a driver alert SMS
 * @param {string} driverPhoneNumber
 * @param {string} messageBody
 */
async function sendDriverAlert(driverPhoneNumber, messageBody) {
  const message = `DRIVER ALERT: ${messageBody}`;
  await sendMessage(driverPhoneNumber, message);
}

/**
 * Sends a customer notification SMS
 * @param {string} customerPhoneNumber
 * @param {string} messageBody
 */
async function sendCustomerNotification(customerPhoneNumber, messageBody) {
  const message = `Notification: ${messageBody}`;
  await sendMessage(customerPhoneNumber, message);
}

/**
 * Sends a delivery status update SMS
 * @param {string} recipientPhoneNumber
 * @param {string} deliveryStatus
 */
async function sendDeliveryStatusUpdate(recipientPhoneNumber, deliveryStatus) {
  const message = `Your delivery status: ${deliveryStatus}`;
  await sendMessage(recipientPhoneNumber, message);
}

/**
 * Sends a group notification SMS to multiple recipients
 * @param {Array<string>} phoneNumbers - Array of phone numbers
 * @param {string} messageBody
 */
async function sendGroupNotification(phoneNumbers, messageBody) {
  if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
    console.error('Phone numbers array is invalid or empty.');
    return;
  }

  // Validate all phone numbers before sending
  const invalidNumbers = phoneNumbers.filter((number) => !isValidPhoneNumber(number));
  if (invalidNumbers.length > 0) {
    console.error(`Invalid phone numbers found: ${invalidNumbers.join(', ')}`);
    return;
  }

  const promises = phoneNumbers.map((number) => sendMessage(number, messageBody));
  await Promise.all(promises);
}

// Example usage:
// sendDriverAlert('+15551234567', 'New delivery assignment available.');
// sendCustomerNotification('+15557654321', 'Your order has been shipped.');
// sendDeliveryStatusUpdate('+15551234567', 'Delivered successfully.');
// sendGroupNotification(['+15551234567', '+15557654321'], 'Emergency alert: Please check your app for updates.');