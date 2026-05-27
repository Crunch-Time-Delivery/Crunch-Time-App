const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // add other fields like price if needed
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: String,
  website: String,
  address: String,
  // You can embed menu items if desired
  menuItems: [MenuItemSchema],
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);