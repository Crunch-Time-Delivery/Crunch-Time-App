const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' }); // change to your region

const location = new AWS.Location({ apiVersion: '2020-11-19' });

// Function to create a tracker
async function createTracker(trackerName) {
    const params = {
        TrackerName: trackerName,
        Description: 'Tracking driver location',
        PricingPlan: 'RequestBasedUsage',
        PricingPlanStatus: 'Active'
    };
    try {
        const data = await location.createTracker(params).promise();
        console.log('Tracker created:', data);
    } catch (err) {
        console.error('Error creating tracker:', err);
    }
}

// Function to create/register a device for a driver
async function createDevice(trackerName, deviceId) {
    const params = {
        TrackerName: trackerName,
        DeviceId: deviceId,
        Description: 'Driver device'
    };
    try {
        await location.tagResource({ ResourceARN: `arn:aws:geo:region:account-id:tracker/${trackerName}`, Tags: { DeviceId: deviceId } }).promise();
        console.log(`Device ${deviceId} registered to tracker ${trackerName}`);
    } catch (err) {
        console.error('Error registering device:', err);
    }
}

// Function to update device position
async function updateDevicePosition(trackerName, deviceId, position) {
    const params = {
        TrackerName: trackerName,
        Updates: [
            {
                DeviceId: deviceId,
                Position: position,
                SampleTime: new Date().toISOString()
            }
        ]
    };
    try {
        await location.batchUpdateDevicePosition(params).promise();
        console.log(`Position for ${deviceId} updated to`, position);
    } catch (err) {
        console.error('Error updating position:', err);
    }
}

// Function to continuously update position for a driver
function trackDriverLivePosition(trackerName, driverId, getCurrentPosition, intervalMs = 5000) {
    setInterval(async () => {
        const position = await getCurrentPosition(); // Should return [longitude, latitude]
        await updateDevicePosition(trackerName, driverId, position);
    }, intervalMs);
}

// Example usage:

// Replace with your actual tracker name and driver ID
const trackerName = 'DriverTracker';
const driverId = 'driver-123';

// Function to get current position (replace with real GPS data source)
async function getCurrentPosition() {
    // For demo, it returns a fixed point, or integrate with GPS module
    return  getCurrentPosition(); 
}

// Start live tracking
// trackDriverLivePosition(trackerName, driverId, getCurrentPosition);
