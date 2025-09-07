const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder
} = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

// POST /api/orders
router.post('/', authenticate, createOrder);

// GET /api/orders
router.get('/', authenticate, getUserOrders);

// GET /api/orders/:id
router.get('/:id', authenticate, getOrder);

module.exports = router;