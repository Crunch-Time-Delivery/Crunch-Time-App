import { GetDevicePositionCommand } from "@aws-sdk/client-location";

/**
 * Fetches live device location and updates the marker on the map.
 * @param {Object} client - AWS Location client instance.
 * @param {Object} marker - MapLibre marker instance.
 * @param {Object} options - Optional configuration.
 * @param {string} options.trackerName - Name of the AWS Location tracker.
 * @param {string} options.deviceId - Device ID to fetch position for.
 * @param {number} options.pollInterval - Polling interval in milliseconds.
 */
async function getLiveLocation(client, marker, options = {}) {
  const {
    trackerName = "MyDeviceTracker",
    deviceId = "device-001",
    pollInterval = 5000,
  } = options;

  if (!client || typeof client.send !== 'function') {
    console.error('Invalid AWS Location client.');
    return;
  }
  if (!marker || typeof marker.setLngLat !== 'function') {
    console.error('Invalid MapLibre marker.');
    return;
  }

  try {
    const command = new GetDevicePositionCommand({
      TrackerName: trackerName,
      DeviceId: deviceId,
    });

    const response = await client.send(command);

    if (response.Position && response.Position.length === 2) {
      const [lng, lat] = response.Position;

      // Update the MapLibre marker position
      marker.setLngLat([lng, lat]);
    } else {
      console.warn("Invalid position response:", response.Position);
    }
  } catch (error) {
    console.error("Error fetching device position:", error);
  } finally {
    // Schedule next update
    setTimeout(() => getLiveLocation(client, marker, options), pollInterval);
  }
}

// Usage example (replace with your actual client and marker instances)
const awsLocationClient = /* initialize your AWS Location client */;
const mapLibreMarker = /* your MapLibre marker instance */;

// Start polling
getLiveLocation(awsLocationClient, mapLibreMarker, {
  trackerName: "YourTrackerName",
  deviceId: "your-device-id",
  pollInterval: 5000,
});
