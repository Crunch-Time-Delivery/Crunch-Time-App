const Restaurant = require('../models/Restaurant');

// Get all restaurants
exports.getAll = async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
};

// Create or update a restaurant
exports.upsert = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const updated = await Restaurant.findOneAndUpdate({ _id: id }, data, { new: true, upsert: true });
  res.json(updated);
};

// Remove a restaurant
exports.delete = async (req, res) => {
  const { id } = req.params;
  await Restaurant.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
};