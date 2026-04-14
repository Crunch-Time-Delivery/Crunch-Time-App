// Import AWS SDK
import AWS from 'aws-sdk';
// Configure AWS SDK with your region and credentials
AWS.config.update({
  region: 'YOUR_AWS_REGION', // e.g., 'us-east-1'
  credentials: new AWS.Credentials('YOUR_ACCESS_KEY_ID', 'YOUR_SECRET_ACCESS_KEY'),
});

// Create a Location Service client
const location = new AWS.Location({ apiVersion: '2020-11-19' });

// Function to send position update for an order, including userId
async function updateOrderPosition(deviceId, position, userId) {
  const params = {
    TrackerName: 'YourTrackerName', // Replace with your tracker resource name
    DeviceId: deviceId,
    SampleTime: new Date().toISOString(),
    Position: position, // [longitude, latitude]
    PositionProperties: {
      userId: userId, // Attach user ID or other custom info
    },
  };

  try {
    const result = await location.sendPositionUpdate(params).promise();
    console.log('Position updated:', result);
  } catch (err) {
    console.error('Error updating position:', err);
  }
}

// Function to get the current position and associated properties (like userId)
async function getOrderPosition(deviceId) {
  const params = {
    TrackerName: 'YourTrackerName', // Replace with your tracker resource name
    DeviceId: deviceId,
  };

  try {
    const result = await location.getDevicePosition(params).promise();
    console.log('Current position:', result.Position);
    console.log('Associated properties:', result.PositionProperties);
    // Access userId if available
    const userId = result.PositionProperties?.userId;
    if (userId) {
      console.log('User ID:', userId);
    } else {
      console.log('No userId found in position properties.');
    }
  } catch (err) {
    console.error('Error fetching position:', err);
  }
}

// Usage example:
const deviceId = 'order-12345';
const newPosition = [-123.3656, 48.4284]; // [longitude, latitude]
const userId = 'user-7890';

// Send position update with userId
updateOrderPosition(deviceId, newPosition, userId);

// Fetch current position and associated userId
getOrderPosition(deviceId);
