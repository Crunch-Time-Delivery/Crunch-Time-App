// controllers/restaurantController.js
const Restaurant = require('../models/Restaurant');

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a restaurant by name
exports.getRestaurantByName = async (req, res) => {
  try {
    const name = req.params.name;
    const restaurant = await Restaurant.findOne({ name: name });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
  const restaurant = new Restaurant(req.body);
  try {
    const newRestaurant = await restaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a restaurant by name
exports.updateRestaurant = async (req, res) => {
  try {
    const name = req.params.name;
    const updated = await Restaurant.findOneAndUpdate({ name: name }, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a restaurant by name
exports.deleteRestaurant = async (req, res) => {
  try {
    const name = req.params.name;
    const deleted = await Restaurant.findOneAndDelete({ name: name });
    if (!deleted) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};