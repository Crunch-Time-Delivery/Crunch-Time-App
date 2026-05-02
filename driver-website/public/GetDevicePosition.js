
import { GetDevicePositionCommand } from "@aws-sdk/client-location";

// Assuming you have initialized AWS SDK client and marker elsewhere
// For better modularity, consider passing them as parameters to the function

async function getLiveLocation(client, marker) {
  try {
    const command = new GetDevicePositionCommand({
      TrackerName: "MyDeviceTracker",
      DeviceId: "device-001",
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
  }
}

// Usage example (replace with your actual client and marker instances)
const client = /* initialize your AWS Location client */;
const marker = /* your MapLibre marker instance */;

// Poll for updates every 5 seconds (5000 ms)
setInterval(() => getLiveLocation(client, marker), 5000);