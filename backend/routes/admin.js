const express = require('express');
const router = express.Router();
const {
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats
} = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Apply authentication and admin check to all routes
router.use(authenticate, isAdmin);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Food Items Management
router.post('/food-items', createFoodItem);
router.put('/food-items/:id', updateFoodItem);
router.delete('/food-items/:id', deleteFoodItem);

// Restaurant Management
router.post('/restaurants', createRestaurant);
router.put('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);

// Order Management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;