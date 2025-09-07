const db = require('../database/db');

class User {
  static create(userData) {
    return db.insert('users', userData);
  }

  static findById(id) {
    return db.findById('users', id);
  }

  static findByEmail(email) {
    return db.findOne('users', { email });
  }

  static findAll() {
    return db.find('users');
  }

  static update(id, updates) {
    return db.update('users', id, updates);
  }

  static delete(id) {
    return db.delete('users', id);
  }
}

module.exports = User;