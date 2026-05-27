// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders
router.get('/', orderController.getAllOrders);

// Get order by orderId
router.get('/:orderId', orderController.getOrderById);

// Create new order
router.post('/', orderController.createOrder);

// Update order by orderId
router.put('/:orderId', orderController.updateOrder);

// Delete order by orderId
router.delete('/:orderId', orderController.deleteOrder);

module.exports = router;