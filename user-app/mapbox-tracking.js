const express = require('express');
const app = express();
app.use(express.json());

const locations = {}; // Store user locations in-memory, keyed by userId

// Endpoint to update user location
app.post('/update-location', (req, res) => {
  const { userId, latitude, longitude } = req.body;
  if (!userId || !latitude || !longitude) {
    return res.status(400).json({ message: 'Missing parameters' });
  }
  locations[userId] = { latitude, longitude, timestamp: new Date() };
  res.json({ message: 'Location updated', userId, location: locations[userId] });
});

// Endpoint to get all user locations
app.get('/tracking', (req, res) => {
  res.json(locations);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mapbox tracking API running on port ${PORT}`);
});