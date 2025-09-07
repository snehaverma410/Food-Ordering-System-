const db = require('../database/db');

class FoodItem {
  static create(foodData) {
    return db.insert('foodItems', foodData);
  }

  static findById(id) {
    return db.findById('foodItems', id);
  }

  static findByRestaurant(restaurantId) {
    return db.find('foodItems', { restaurantId });
  }

  static findAll() {
    return db.find('foodItems');
  }

  static update(id, updates) {
    return db.update('foodItems', id, updates);
  }

  static delete(id) {
    return db.delete('foodItems', id);
  }

  static findByCategory(category) {
    return db.find('foodItems', { category });
  }
}

module.exports = FoodItem;