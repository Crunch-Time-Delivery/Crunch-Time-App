// routes/deliveryRoutes.js
const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Get all deliveries
router.get('/', deliveryController.getAllDeliveries);

// Get delivery by orderId
router.get('/:orderId', deliveryController.getDeliveryByOrderId);

// Create a new delivery
router.post('/', deliveryController.createDelivery);

// Update delivery by orderId
router.put('/:orderId', deliveryController.updateDelivery);

// Delete delivery by orderId
router.delete('/:orderId', deliveryController.deleteDelivery);

module.exports = router;