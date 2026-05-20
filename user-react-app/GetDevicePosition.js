import { LocationClient, GetDevicePositionCommand } from "@aws-sdk/client-location";

// Initialize the AWS Location client outside to reuse
const client = new LocationClient({ region: 'your-region' });

// Configuration
const trackerName = "MyDeviceTracker";
const deviceId = "device-001";
const pollingInterval = 5500; // milliseconds

// Function to get live location
async function getLiveLocation() {
  const command = new GetDevicePositionCommand({
    TrackerName: trackerName,
    DeviceId: deviceId,
  });

  try {
    const response = await client.send(command);
    if (response.Position && response.Position.length === 2) {
      const [lng, lat] = response.Position;
      
      // Update your MapLibre marker here
      if (marker && typeof marker.setLngLat === 'function') {
        marker.setLngLat([lng, lat]);
        console.log(`Updated position to [${lng}, ${lat}]`);
      } else {
        console.warn('Marker is not initialized or invalid');
      }
    } else {
      console.warn('No position data received');
    }
  } catch (error) {
    console.error('Error fetching device position:', error);
  }
}

// Start polling at specified interval
setInterval(getLiveLocation, pollingInterval);