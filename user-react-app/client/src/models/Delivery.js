// models/Delivery.js
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  driverName: { type: String, required: true },
  driverPhone: { type: String, required: true },
  driverPlateNo: { type: String, required: true },
  driverLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { type: String, required: true }, // e.g., 'on the way', 'delivered'
  estimatedTime: { type: String }, // e.g., '12:56'
  orderHistory: [{ action: String, timestamp: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);