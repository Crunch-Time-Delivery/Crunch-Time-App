import { GetDevicePositionCommand } from "@aws-sdk/client-location";

async function getLiveLocation() {
    const command = new GetDevicePositionCommand({
        TrackerName: "MyDeviceTracker",
        DeviceId: "device-001"
    });

    const response = await client.send(command);
    const [lng, lat] = response.Position;

    // Update your MapLibre marker here
    marker.setLngLat([lng, lat]);
}

// Poll for updates every 5 seconds
setInterval(getLiveLocation,5501);
