import { LocationClient, BatchUpdateDevicePositionCommand } from "@aws-sdk/client-location";

// 1. Initialize the client (ensure AWS credentials are configured properly, e.g., via Cognito or environment variables)
const client = new LocationClient({ region: "us-east-1" });

// 2. Function to send position updates to AWS Location
async function updateAWSTracker(position) {
  const { latitude, longitude } = position.coords;

  const command = new BatchUpdateDevicePositionCommand({
    TrackerName: "MyDeviceTracker", // Replace with your tracker name
    Updates: [{
      DeviceId: "device-001", // Use your device ID here
      SampleTime: new Date().toISOString(), // Use ISO string for consistency
      Position: [longitude, latitude], // Note: AWS Location expects [lng, lat]
    }],
  });

  try {
    await client.send(command);
    console.log("Position updated successfully");
  } catch (error) {
    console.error("Error updating position:", error);
  }
}

// 3. Start live tracking with browser's geolocation API
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    updateAWSTracker,
    (err) => console.error("Geolocation error:", err),
    { enableHighAccuracy: true }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}