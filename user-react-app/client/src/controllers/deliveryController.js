// controllers/deliveryController.js
const Delivery = require('../models/Delivery');

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get delivery by orderId
exports.getDeliveryByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const delivery = await Delivery.findOne({ orderId });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new delivery
exports.createDelivery = async (req, res) => {
  const delivery = new Delivery(req.body);
  try {
    const newDelivery = await delivery.save();
    res.status(201).json(newDelivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update delivery by orderId
exports.updateDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updated = await Delivery.findOneAndUpdate({ orderId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Delivery not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete delivery by orderId
exports.deleteDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deleted = await Delivery.findOneAndDelete({ orderId });
    if (!deleted) return res.status(404).json({ message: 'Delivery not found' });
    res.json({ message: 'Delivery deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};