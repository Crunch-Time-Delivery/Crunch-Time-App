// locationMap.js
const { LocationClient, CreateMapCommand, DeleteMapCommand, DescribeMapCommand, UpdateMapCommand } = require("@aws-sdk/client-location");

// Initialize the client
const client = new LocationClient({ region: "us-east-1" }); // replace with your region

// Update a map (e.g., change style)
async function updateMap(mapName, newStyle) {
  const command = new UpdateMapCommand({
    MapName: mapName,
    Style: newStyle,
  });
  try {
    const result = await client.send(command);
    console.log("Map updated:", result);
  } catch (err) {
    console.error("Error updating map:", err);
  }
}


// Export functions
module.exports = {
  updateMap
};











