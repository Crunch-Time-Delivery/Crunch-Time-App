import { LocationClient, BatchUpdateDevicePositionCommand } from "@aws-sdk/client-location";

// Configure your AWS region
const AWS_REGION = "us-east-1";

// Initialize the AWS Location client (ensure AWS credentials are configured)
const client = new LocationClient({ region: AWS_REGION });

// Device and tracker configuration
const TRACKER_NAME = "MyDeviceTracker"; // Replace with your tracker name
const DEVICE_ID = "device-001";         // Replace with your device ID

let watchId = null; // To store the watcher ID

// Function to send position updates to AWS Location
async function updateAWSTracker(position) {
  const { latitude, longitude } = position.coords;

  const command = new BatchUpdateDevicePositionCommand({
    TrackerName: TRACKER_NAME,
    Updates: [{
      DeviceId: DEVICE_ID,
      SampleTime: new Date().toISOString(),
      Position: [longitude, latitude], // AWS expects [lng, lat]
    }],
  });

  try {
    await client.send(command);
    console.log(`Position updated: (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`);
  } catch (error) {
    console.error("Error updating position:", error);
  }
}

// Function to start live tracking
function startTracking() {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser.");
    return;
  }
  if (watchId !== null) {
    console.log("Tracking is already active.");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    updateAWSTracker,
    (err) => console.error("Geolocation error:", err),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );

  console.log("Live tracking started.");
}

// Function to stop live tracking
function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    console.log("Live tracking stopped.");
  } else {
    console.log("Tracking is not active.");
  }
}

// Optional: Auto-start tracking
// startTracking();

// Export functions if you want to control from other modules
export { startTracking, stopTracking };