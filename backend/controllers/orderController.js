const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');

// Create order
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const foodItem = FoodItem.findById(item.foodItemId);
      if (!foodItem) {
        return res.status(400).json({ message: `Food item ${item.foodItemId} not found` });
      }
      
      const itemTotal = foodItem.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        foodItemId: item.foodItemId,
        name: foodItem.name,
        price: foodItem.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Create order
    const order = Order.create({
      userId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user orders
const getUserOrders = (req, res) => {
  try {
    const orders = Order.findByUser(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single order
const getOrder = (req, res) => {
  try {
    const order = Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder
};