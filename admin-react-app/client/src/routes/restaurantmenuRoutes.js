const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantmenuController');

router.get('/', restaurantController.getAll);
router.post('/', restaurantController.upsert); // create new
router.put('/:id', restaurantController.upsert); // update existing
router.delete('/:id', restaurantController.delete);

module.exports = router;