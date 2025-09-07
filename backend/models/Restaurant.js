const db = require('../database/db');

class Restaurant {
  static create(restaurantData) {
    return db.insert('restaurants', restaurantData);
  }

  static findById(id) {
    return db.findById('restaurants', id);
  }

  static findAll() {
    return db.find('restaurants');
  }

  static update(id, updates) {
    return db.update('restaurants', id, updates);
  }

  static delete(id) {
    return db.delete('restaurants', id);
  }
}

module.exports = Restaurant;