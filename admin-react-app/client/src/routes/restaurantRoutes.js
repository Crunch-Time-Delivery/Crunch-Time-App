const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/', restaurantController.getAll);
router.post('/', restaurantController.upsert); // To add new
router.put('/:id', restaurantController.upsert); // To update existing
router.delete('/:id', restaurantController.delete);

module.exports = router;