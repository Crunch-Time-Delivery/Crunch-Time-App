// routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Get all restaurants
router.get('/', restaurantController.getAllRestaurants);

// Get a restaurant by name
router.get('/:name', restaurantController.getRestaurantByName);

// Create a new restaurant
router.post('/', restaurantController.createRestaurant);

// Update a restaurant by name
router.put('/:name', restaurantController.updateRestaurant);

// Delete a restaurant by name
router.delete('/:name', restaurantController.deleteRestaurant);

module.exports = router;