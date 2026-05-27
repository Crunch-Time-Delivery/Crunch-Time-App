const Item = require('../models/Item');

exports.getAllItems = async (req, res) => {
  const items = await Item.find();
  res.json(items);
};

exports.addItem = async (req, res) => {
  // Add item logic
};