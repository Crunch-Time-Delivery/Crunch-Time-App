










const {
  LocationClient,
  CreateMapCommand,
  DeleteMapCommand,
  DescribeMapCommand,
  UpdateMapCommand
} = require("@aws-sdk/client-location");

// Initialize the Location Client
const client = new LocationClient({ region: "us-east-1" }); // Replace with your region

/**
 * Update a map's style.
 * @param {string} mapName - The name of the map to update.
 * @param {string} newStyle - The new style URL or JSON.
 */
async function updateMap(mapName, newStyle) {
  if (!mapName || typeof mapName !== 'string') {
    throw new Error("Invalid mapName");
  }
  if (!newStyle || typeof newStyle !== 'string') {
    throw new Error("Invalid newStyle");
  }

  const command = new UpdateMapCommand({
    MapName: mapName,
    Style: newStyle,
  });

  try {
    const result = await client.send(command);
    console.log(`Map "${mapName}" updated successfully:`, result);
    return result;
  } catch (err) {
    console.error(`Error updating map "${mapName}":`, err);
    throw err;
  }
}

/**
 * Delete a map by name.
 * @param {string} mapName - The name of the map to delete.
 */
async function deleteMap(mapName) {
  if (!mapName || typeof mapName !== 'string') {
    throw new Error("Invalid mapName");
  }

  const command = new DeleteMapCommand({ MapName: mapName });
  try {
    const result = await client.send(command);
    console.log(`Map "${mapName}" deleted successfully:`, result);
    return result;
  } catch (err) {
    console.error(`Error deleting map "${mapName}":`, err);
    throw err;
  }
}

/**
 * Describe a map by name.
 * @param {string} mapName - The name of the map to describe.
 */
async function describeMap(mapName) {
  if (!mapName || typeof mapName !== 'string') {
    throw new Error("Invalid mapName");
  }

  const command = new DescribeMapCommand({ MapName: mapName });
  try {
    const result = await client.send(command);
    console.log(`Map "${mapName}" details:`, result);
    return result;
  } catch (err) {
    console.error(`Error describing map "${mapName}":`, err);
    throw err;
  }
}

// Export functions
module.exports = {
  updateMap,
  deleteMap,
  describeMap
};