const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.dataPath = path.join(__dirname, 'data');
    this.ensureDataDirectory();
    this.initializeData();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
  }

  initializeData() {
    // Initialize default data if files don't exist
    const defaultData = {
      users: [],
      restaurants: [
        {
          id: '1',
          name: 'Bella Vista',
          image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
          cuisine: 'Italian',
          rating: 4.5,
          deliveryTime: '30-45 min'
        },
        {
          id: '2',
          name: 'Spice Garden',
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
          cuisine: 'Indian',
          rating: 4.3,
          deliveryTime: '25-35 min'
        },
        {
          id: '3',
          name: 'Dragon Palace',
          image: 'https://images.pexels.com/photos/1148086/pexels-photo-1148086.jpeg?auto=compress&cs=tinysrgb&w=800',
          cuisine: 'Chinese',
          rating: 4.7,
          deliveryTime: '35-50 min'
        }
      ],
      foodItems: [
        {
          id: '1',
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
          price: 12.99,
          image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
          restaurantId: '1',
          category: 'Main Course',
          available: true
        },
        {
          id: '2',
          name: 'Chicken Tikka Masala',
          description: 'Tender chicken in a rich, creamy tomato-based sauce',
          price: 15.99,
          image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=800',
          restaurantId: '2',
          category: 'Main Course',
          available: true
        },
        {
          id: '3',
          name: 'Sweet & Sour Pork',
          description: 'Crispy pork with bell peppers and pineapple in sweet & sour sauce',
          price: 13.99,
          image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
          restaurantId: '3',
          category: 'Main Course',
          available: true
        },
        {
          id: '4',
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with parmesan cheese and croutons',
          price: 8.99,
          image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=800',
          restaurantId: '1',
          category: 'Salad',
          available: true
        },
        {
          id: '5',
          name: 'Pad Thai',
          description: 'Stir-fried rice noodles with shrimp, tofu, and bean sprouts',
          price: 11.99,
          image: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=800',
          restaurantId: '3',
          category: 'Main Course',
          available: true
        },
        {
          id: '6',
          name: 'Chocolate Brownie',
          description: 'Rich chocolate brownie served with vanilla ice cream',
          price: 6.99,
          image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800',
          restaurantId: '1',
          category: 'Dessert',
          available: true
        }
      ],
      orders: []
    };

    Object.keys(defaultData).forEach(collection => {
      const filePath = path.join(this.dataPath, `${collection}.json`);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData[collection], null, 2));
      }
    });
  }

  read(collection) {
    try {
      const filePath = path.join(this.dataPath, `${collection}.json`);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
      return [];
    }
  }

  write(collection, data) {
    try {
      const filePath = path.join(this.dataPath, `${collection}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${collection}:`, error);
      return false;
    }
  }

  findById(collection, id) {
    const data = this.read(collection);
    return data.find(item => item.id === id);
  }

  findOne(collection, query) {
    const data = this.read(collection);
    return data.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  find(collection, query = {}) {
    const data = this.read(collection);
    if (Object.keys(query).length === 0) return data;
    
    return data.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  insert(collection, document) {
    const data = this.read(collection);
    document.id = document.id || require('uuid').v4();
    document.createdAt = new Date().toISOString();
    data.push(document);
    this.write(collection, data);
    return document;
  }

  update(collection, id, updates) {
    const data = this.read(collection);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
      this.write(collection, data);
      return data[index];
    }
    return null;
  }

  delete(collection, id) {
    const data = this.read(collection);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      const deleted = data.splice(index, 1)[0];
      this.write(collection, data);
      return deleted;
    }
    return null;
  }
}

module.exports = new Database();