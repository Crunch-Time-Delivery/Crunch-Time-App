// Import AWS SDK
import AWS from 'aws-sdk';

// Configure AWS SDK with environment variables or configuration object
AWS.config.update({
  region: process.env.AWS_REGION || 'YOUR_AWS_REGION', // e.g., 'us-east-1'
  credentials: new AWS.Credentials(
    process.env.AWS_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID',
    process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY'
  ),
});

// Create Location Service client
const location = new AWS.Location({ apiVersion: '2020-11-19' });

/**
 * Send position update for a device (order)
 * @param {string} deviceId - Unique device or order ID
 * @param {Array<number>} position - [longitude, latitude]
 */
async function updateOrderPosition(deviceId, position) {
  const params = {
    TrackerName: 'YourTrackerName', // Replace with your tracker resource name
    DeviceId: deviceId,
    SampleTime: new Date().toISOString(),
    Position: position,
    // Optional: add PositionProperties if needed
  };

  try {
    const result = await location.sendPositionUpdate(params).promise();
    console.log('Position updated:', result);
  } catch (err) {
    console.error(`Error updating position for device ${deviceId}:`, err);
  }
}

/**
 * Get current position of a device (order)
 * @param {string} deviceId - Unique device or order ID
 * @returns {Object|null} - Position data or null if error
 */
async function getOrderPosition(deviceId) {
  const params = {
    TrackerName: 'YourTrackerName', // Your tracker resource name
    DeviceId: deviceId,
  };

  try {
    const result = await location.getDevicePosition(params).promise();
    if (result && result.Position) {
      console.log(`Current position of ${deviceId}:`, result.Position);
      return result.Position; // [longitude, latitude]
    } else {
      console.warn(`No position data found for device ${deviceId}`);
      return null;
    }
  } catch (err) {
    console.error(`Error fetching position for device ${deviceId}:`, err);
    return null;
  }
}

// Usage example: replace with your actual device/order ID and position
const deviceId = 'order-12345';
const newPosition = [-123.3656, 48.4284]; // [longitude, latitude]

// Update order position
updateOrderPosition(deviceId, newPosition);

// Fetch current position
getOrderPosition(deviceId).then(position => {
  if (position) {
    // Do something with the position
  }
});