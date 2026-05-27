const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  vendor: String,
  itemName: String,
  description: String,
  category: String,
  price: Number,
  discount: Number,
  portion: String,
  prepTime: Number,
  isVeg: Boolean,
  isSpicy: Boolean,
  stockStatus: String,
});

module.exports = mongoose.model('Item', ItemSchema);