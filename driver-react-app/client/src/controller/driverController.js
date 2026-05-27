const Driver = require('../models/Driver');

// Get driver by ID
exports.getDriverById = async (req, res) => {
  const { id } = req.params;
  try {
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching driver' });
  }
};

// Update driver info
exports.updateDriver = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const driver = await Driver.findByIdAndUpdate(id, updateData, { new: true });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: 'Error updating driver' });
  }
};