const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' }); // Change to your region

const location = new AWS.Location({ apiVersion: '2020-11-19' });

// Function to create a tracker for pickups
async function createPickupTracker(trackerName) {
    const params = {
        TrackerName: trackerName,
        Description: 'Tracking user pickup locations',
        PricingPlan: 'RequestBasedUsage',
        PricingPlanStatus: 'Active'
    };
    try {
        const data = await location.createTracker(params).promise();
        console.log('Pickup Tracker created:', data);
    } catch (err) {
        console.error('Error creating pickup tracker:', err);
    }
}

// Function to create/register a device (user location)
async function registerUserLocation(trackerName, userId) {
    const params = {
        TrackerName: trackerName,
        DeviceId: userId,
        Description: `Location for user ${userId}`
    };
    try {
        // Tag resource to associate device with userId if needed
        await location.tagResource({ ResourceARN: `arn:aws:geo:region:account-id:tracker/${trackerName}`, Tags: { UserId: userId } }).promise();
        console.log(`User location device registered: ${userId}`);
    } catch (err) {
        console.error('Error registering user device:', err);
    }
}

// Function to update user location
async function updateUserLocation(trackerName, userId, position) {
    const params = {
        TrackerName: trackerName,
        Updates: [
            {
                DeviceId: userId,
                Position: position, // [longitude, latitude]
                SampleTime: new Date().toISOString()
            }
        ]
    };
    try {
        await location.batchUpdateDevicePosition(params).promise();
        console.log(`Updated location for user ${userId}:`, position);
    } catch (err) {
        console.error('Error updating user location:', err);
    }
}

// Example usage:
const trackerName = 'PickupLocationsTracker';
const userId = 'user-456';

// Uncomment to create tracker
// createPickupTracker(trackerName);

// Register user device
// registerUserLocation(trackerName, userId);

// Update user location (example coordinates)
const userPosition_pickup = createPickupTracker(trackerName); 
const userPosition = registerUserLocation(trackerName, userId);

// Uncomment to update location
// updateUserLocation(trackerName, userId, userPosition);