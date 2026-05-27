// models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  options: {
    extraCheese: Boolean,
    lessSalt: Boolean,
    instructions: String
  }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  subtotal: Number,
  discount: Number,
  serviceFee: Number,
  deliveryFee: Number,
  tip: Number,
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);