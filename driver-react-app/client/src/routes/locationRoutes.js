const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.post('/', locationController.saveLocation); // Save location
router.get('/latest/:driverId', locationController.getLatestLocation); // Get latest location

module.exports = router;