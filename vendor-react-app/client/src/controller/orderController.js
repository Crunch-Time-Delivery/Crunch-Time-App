const Order = require('../models/Order');

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};

exports.createOrder = async (req, res) => {
  // create order logic
};