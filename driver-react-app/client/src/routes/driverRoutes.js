const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.get('/:id', driverController.getDriverById);
router.put('/:id', driverController.updateDriver);

module.exports = router;