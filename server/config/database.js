const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeTables();
  }
});

// Initialize database tables
function initializeTables() {
  // Customers table
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    plan TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Menu items table
  db.run(`CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    available BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'Pending',
    order_date DATE NOT NULL,
    delivery_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  )`);

  // Order items table (for multiple items per order)
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    menu_item_id INTEGER NOT NULL,
    menu_item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
  )`);

  // Insert sample data
  insertSampleData();
}

function insertSampleData() {
  // Check if data already exists
  db.get("SELECT COUNT(*) as count FROM customers", (err, row) => {
    if (err) {
      console.error(err);
      return;
    }
    
    if (row.count === 0) {
      console.log('📊 Inserting sample data...');
      
      // Insert sample customers
      const customers = [
        ['John Doe', '9876543210', '123 Main St, Mumbai', 'Monthly'],
        ['Jane Smith', '9876543211', '456 Oak Ave, Delhi', 'Weekly'],
        ['Mike Johnson', '9876543212', '789 Pine Rd, Bangalore', 'Daily'],
        ['Priya Sharma', '9876543213', '321 Lake View, Chennai', 'Monthly'],
        ['Raj Patel', '9876543214', '654 Garden St, Pune', 'Weekly']
      ];

      customers.forEach(customer => {
        db.run("INSERT INTO customers (name, phone, address, plan) VALUES (?, ?, ?, ?)", customer);
      });

      // Insert sample menu items
      const menuItems = [
        ['Dal Rice', 80, 'Vegetarian'],
        ['Chicken Curry', 120, 'Non-Vegetarian'],
        ['Paneer Masala', 100, 'Vegetarian'],
        ['Fish Curry', 140, 'Non-Vegetarian'],
        ['Vegetable Biryani', 90, 'Vegetarian'],
        ['Mutton Curry', 160, 'Non-Vegetarian'],
        ['Rajma Chawal', 85, 'Vegetarian'],
        ['Chole Bhature', 95, 'Vegetarian'],
        ['Butter Chicken', 150, 'Non-Vegetarian'],
        ['Aloo Gobi', 75, 'Vegetarian']
      ];

      menuItems.forEach(item => {
        db.run("INSERT INTO menu_items (name, price, category) VALUES (?, ?, ?)", item);
      });

      // Insert sample orders
      const orders = [
        [1, 'John Doe', 150, 'Delivered', '2024-06-10', '123 Main St, Mumbai'],
        [2, 'Jane Smith', 120, 'Pending', '2024-06-12', '456 Oak Ave, Delhi'],
        [3, 'Mike Johnson', 200, 'Delivered', '2024-06-11', '789 Pine Rd, Bangalore'],
        [4, 'Priya Sharma', 180, 'Confirmed', '2024-06-12', '321 Lake View, Chennai'],
        [1, 'John Doe', 240, 'Out for Delivery', '2024-06-12', '123 Main St, Mumbai']
      ];

      orders.forEach(order => {
        db.run("INSERT INTO orders (customer_id, customer_name, total_amount, status, order_date, delivery_address) VALUES (?, ?, ?, ?, ?, ?)", order);
      });

      console.log('✅ Sample data inserted successfully');
    }
  });
}

module.exports = db;