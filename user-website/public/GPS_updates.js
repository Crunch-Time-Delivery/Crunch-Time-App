import { LocationClient, BatchUpdateDevicePositionCommand } from "@aws-sdk/client-location";

// 1. Initialize the client (ensure you have authenticated using Cognito or API Keys)
const client = new LocationClient({ region: "us-east-1" });

// 2. Function to send the position to AWS
async function updateAWSTracker(position) {
    const { latitude, longitude } = position.coords;
    
    const command = new BatchUpdateDevicePositionCommand({
        TrackerName: "MyDeviceTracker", // Replace with your tracker name
        Updates: [{
            DeviceId: "device-001",
            SampleTime: new Date(),
            Position: [longitude, latitude] // Note: Amazon Location uses [lng, lat] order
        }]
    });

    try {
        await client.send(command);
        console.log("Position updated successfully");
    } catch (error) {
        console.error("Error updating position:", error);
    }
}

// 3. Start live tracking using the browser's watchPosition
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        updateAWSTracker, 
        (err) => console.error(err), 
        { enableHighAccuracy: true }
    );
}
