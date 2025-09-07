const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

// Get all restaurants
const getRestaurants = (req, res) => {
  try {
    const restaurants = Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all food items
const getFoodItems = (req, res) => {
  try {
    const { restaurantId, category } = req.query;
    let foodItems;

    if (restaurantId) {
      foodItems = FoodItem.findByRestaurant(restaurantId);
    } else if (category) {
      foodItems = FoodItem.findByCategory(category);
    } else {
      foodItems = FoodItem.findAll();
    }

    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single food item
const getFoodItem = (req, res) => {
  try {
    const foodItem = FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get restaurant details
const getRestaurant = (req, res) => {
  try {
    const restaurant = Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getRestaurants,
  getFoodItems,
  getFoodItem,
  getRestaurant
};