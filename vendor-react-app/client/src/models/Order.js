const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: String,
  userName: String,
  userEmail: String,
  amount: Number,
  vendorName: String,
  vendorContact: String,
  deliveryAddress: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);