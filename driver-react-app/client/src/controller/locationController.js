const Location = require('../models/Location');

// Save new location
exports.saveLocation = async (req, res) => {
  const { latitude, longitude, driverId } = req.body;
  try {
    const newLocation = new Location({ latitude, longitude, driverId });
    await newLocation.save();
    res.status(201).json({ message: 'Location saved', location: newLocation });
  } catch (err) {
    res.status(500).json({ error: 'Error saving location' });
  }
};

// Get latest location for a driver
exports.getLatestLocation = async (req, res) => {
  const { driverId } = req.params;
  try {
    const location = await Location.findOne({ driverId }).sort({ timestamp: -1 });
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching location' });
  }
};