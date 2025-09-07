const db = require('../database/db');

class Order {
  static create(orderData) {
    return db.insert('orders', {
      ...orderData,
      status: 'pending',
      orderDate: new Date().toISOString()
    });
  }

  static findById(id) {
    return db.findById('orders', id);
  }

  static findByUser(userId) {
    return db.find('orders', { userId });
  }

  static findAll() {
    return db.find('orders');
  }

  static update(id, updates) {
    return db.update('orders', id, updates);
  }

  static delete(id) {
    return db.delete('orders', id);
  }

  static updateStatus(id, status) {
    return db.update('orders', id, { status });
  }
}

module.exports = Order;