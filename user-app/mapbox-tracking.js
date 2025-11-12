const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

// Store user locations in-memory, keyed by userId
const locations = {};

/**
 * Endpoint to update a user's location
 * Expects JSON body with userId, latitude, and longitude
 */
app.post('/update-location', (req, res) => {
  const { userId, latitude, longitude } = req.body;

  // Validate required parameters
  if (!userId || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: 'Missing parameters: userId, latitude, and longitude are required.' });
  }

  // Store location with a timestamp
  locations[userId] = {
    latitude,
    longitude,
    timestamp: new Date()
  };

  res.json({
    message: 'Location updated successfully.',
    userId,
    location: locations[userId]
  });
});

/**
 * Endpoint to get all user locations
 * Returns an object with userIds as keys and location data as values
 */
app.get('/tracking', (req, res) => {
  res.json(locations);
});

/**
 * Endpoint to get a specific user's location
 * URL parameter: userId
 */
app.get('/tracking/:userId', (req, res) => {
  const userId = req.params.userId;
  const userLocation = locations[userId];

  if (!userLocation) {
    return res.status(404).json({ message: 'User not found or no location data available.' });
  }

  res.json({ userId, location: userLocation });
});

/**
 * Endpoint to remove a user's location data
 * URL parameter: userId
 */
app.delete('/tracking/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!locations[userId]) {
    return res.status(404).json({ message: 'User not found.' });
  }

  delete locations[userId];

  res.json({ message: `Location data for user ${userId} has been removed.` });
});

/**
 * Optional: Endpoint to clear all locations (for admin or reset purposes)
 */
app.delete('/tracking', (req, res) => {
  for (let userId in locations) {
    delete locations[userId];
  }
  res.json({ message: 'All user locations have been cleared.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mapbox tracking API running on port ${PORT}`);
});