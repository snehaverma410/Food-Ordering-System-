const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getFoodItems,
  getFoodItem,
  getRestaurant
} = require('../controllers/foodController');

// GET /api/food/restaurants
router.get('/restaurants', getRestaurants);

// GET /api/food/restaurants/:id
router.get('/restaurants/:id', getRestaurant);

// GET /api/food/items
router.get('/items', getFoodItems);

// GET /api/food/items/:id
router.get('/items/:id', getFoodItem);

module.exports = router;