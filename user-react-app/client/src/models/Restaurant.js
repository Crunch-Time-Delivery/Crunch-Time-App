// models/Restaurant.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  mapLink: { type: String, required: true },
  menu: [menuItemSchema]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);