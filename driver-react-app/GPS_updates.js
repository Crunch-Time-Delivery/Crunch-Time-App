import { LocationClient, BatchUpdateDevicePositionCommand } from "@aws-sdk/client-location";

// Initialize AWS Location client (ensure AWS credentials are configured in your environment)
const client = new LocationClient({ region: "us-east-1" });

// Device and tracker configuration (replace with your actual identifiers)
const TRACKER_NAME = "MyDeviceTracker";
const DEVICE_ID = "device-001";

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
    console.log(`Position updated: (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`);
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

// Optional: Automatically start tracking
// startTracking();

// Expose functions if needed elsewhere
// export { startTracking, stopTracking };