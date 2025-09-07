const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const User = require('../models/User');

// Food Items Management
const createFoodItem = (req, res) => {
  try {
    const foodItem = FoodItem.create(req.body);
    res.status(201).json({
      message: 'Food item created successfully',
      foodItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateFoodItem = (req, res) => {
  try {
    const foodItem = FoodItem.update(req.params.id, req.body);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json({
      message: 'Food item updated successfully',
      foodItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteFoodItem = (req, res) => {
  try {
    const foodItem = FoodItem.delete(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Restaurant Management
const createRestaurant = (req, res) => {
  try {
    const restaurant = Restaurant.create(req.body);
    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateRestaurant = (req, res) => {
  try {
    const restaurant = Restaurant.update(req.params.id, req.body);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({
      message: 'Restaurant updated successfully',
      restaurant
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteRestaurant = (req, res) => {
  try {
    const restaurant = Restaurant.delete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Order Management
const getAllOrders = (req, res) => {
  try {
    const orders = Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOrderStatus = (req, res) => {
  try {
    const { status } = req.body;
    const order = Order.updateStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Dashboard Stats
const getDashboardStats = (req, res) => {
  try {
    const orders = Order.findAll();
    const restaurants = Restaurant.findAll();
    const foodItems = FoodItem.findAll();
    const users = User.findAll();

    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      totalRestaurants: restaurants.length,
      totalFoodItems: foodItems.length,
      totalUsers: users.filter(user => user.role === 'user').length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      completedOrders: orders.filter(order => order.status === 'completed').length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats
};