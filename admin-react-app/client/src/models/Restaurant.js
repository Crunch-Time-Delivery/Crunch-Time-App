const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String },
  website: { type: String },
  address: { type: String }
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String },
  website: { type: String },
  address: { type: String },
  // You can add more fields here
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);