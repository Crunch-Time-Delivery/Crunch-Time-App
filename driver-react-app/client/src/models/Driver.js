const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  driver_name: { type: String, required: true },
  contact: String,
  plate_no: String,
  email: { type: String, required: true, unique: true },
  // Add other fields as needed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Driver', DriverSchema);