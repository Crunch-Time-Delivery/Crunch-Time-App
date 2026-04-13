// Import AWS SDK
import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  region: 'YOUR_AWS_REGION', // e.g., 'us-east-1'
  credentials: new AWS.Credentials('YOUR_ACCESS_KEY_ID', 'YOUR_SECRET_ACCESS_KEY'),
});

// Create a Location Service client
const location = new AWS.Location({ apiVersion: '2020-11-19' });

// Function to send position update for an order
async function updateOrderPosition(deviceId, position) {
  const params = {
    TrackerName: 'YourTrackerName', // Your tracker resource name
    DeviceId: deviceId,
    SampleTime: new Date().toISOString(),
    Position: position, // [longitude, latitude]
    PositionProperties: {
      // Optional: additional properties
    },
  };

  try {
    const result = await location.sendPositionUpdate(params).promise();
    console.log('Position updated:', result);
  } catch (err) {
    console.error('Error updating position:', err);
  }
}

// Function to get the current position of an order
async function getOrderPosition(deviceId) {
  const params = {
    TrackerName: 'YourTrackerName',
    DeviceId: deviceId,
  };

  try {
    const result = await location.getDevicePosition(params).promise();
    console.log('Current position:', result);
  } catch (err) {
    console.error('Error fetching position:', err);
  }
}

// Usage example:
const deviceId = 'order-12345';
const newPosition = [-123.3656, 48.4284]; // [longitude, latitude]

// Update order position
updateOrderPosition(deviceId, newPosition);

// Fetch current position
getOrderPosition(deviceId);