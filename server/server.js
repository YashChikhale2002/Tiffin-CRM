const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data for testing - Replace with actual database later
let mockMenuItems = [
  {
    id: 1,
    name: "Butter Chicken",
    category: "Non-Vegetarian",
    price: 250,
    available: 1,
    description: "Creamy tomato-based chicken curry"
  },
  {
    id: 2,
    name: "Paneer Butter Masala",
    category: "Vegetarian", 
    price: 200,
    available: 1,
    description: "Rich cottage cheese in buttery tomato gravy"
  },
  {
    id: 3,
    name: "Dal Tadka",
    category: "Vegetarian",
    price: 150,
    available: 1,
    description: "Traditional lentil curry with spices"
  },
  {
    id: 4,
    name: "Chicken Biryani",
    category: "Non-Vegetarian",
    price: 300,
    available: 1,
    description: "Aromatic rice with tender chicken pieces"
  },
  {
    id: 5,
    name: "Masala Chai",
    category: "Beverage",
    price: 50,
    available: 1,
    description: "Traditional spiced tea"
  },
  {
    id: 6,
    name: "Gulab Jamun",
    category: "Dessert",
    price: 80,
    available: 1,
    description: "Sweet milk-based dessert balls"
  },
  {
    id: 7,
    name: "Samosa",
    category: "Snacks",
    price: 30,
    available: 1,
    description: "Crispy fried pastry with potato filling"
  }
];

let mockCustomers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    address: "123 Main St, City",
    created_at: "2025-06-01"
  },
  {
    id: 2,
    name: "Jane Smith", 
    email: "jane@example.com",
    phone: "9876543211",
    address: "456 Oak Ave, Town",
    created_at: "2025-06-02"
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com", 
    phone: "9876543212",
    address: "789 Pine Rd, Village",
    created_at: "2025-06-03"
  }
];

let mockOrders = [
  {
    id: 1,
    customer_id: 1,
    customer_name: "John Doe",
    customer_phone: "9876543210",
    delivery_address: "123 Main St, City",
    items: [
      {
        menu_item_id: 1,
        menu_item_name: "Butter Chicken",
        quantity: 2,
        price: 250,
        total_price: 500
      },
      {
        menu_item_id: 5,
        menu_item_name: "Masala Chai",
        quantity: 2,
        price: 50,
        total_price: 100
      }
    ],
    total_amount: 600,
    status: "Delivered",
    order_date: "2025-06-25"
  },
  {
    id: 2,
    customer_id: 2,
    customer_name: "Jane Smith",
    customer_phone: "9876543211", 
    delivery_address: "456 Oak Ave, Town",
    items: [
      {
        menu_item_id: 4,
        menu_item_name: "Chicken Biryani",
        quantity: 1,
        price: 300,
        total_price: 300
      }
    ],
    total_amount: 300,
    status: "Preparing",
    order_date: "2025-06-27"
  },
  {
    id: 3,
    customer_id: 1,
    customer_name: "John Doe",
    customer_phone: "9876543210",
    delivery_address: "123 Main St, City",
    items: [
      {
        menu_item_id: 2,
        menu_item_name: "Paneer Butter Masala",
        quantity: 1,
        price: 200,
        total_price: 200
      },
      {
        menu_item_id: 3,
        menu_item_name: "Dal Tadka",
        quantity: 1,
        price: 150,
        total_price: 150
      }
    ],
    total_amount: 350,
    status: "Pending",
    order_date: "2025-06-27"
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Tiffin CRM API is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      customers: '/api/customers',
      menu: '/api/menu',
      orders: '/api/orders'
    }
  });
});

// ===== CUSTOMER ROUTES =====
app.get('/api/customers', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockCustomers,
      count: mockCustomers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    });
  }
});

app.get('/api/customers/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const customer = mockCustomers.find(c => c.id === id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer',
      error: error.message
    });
  }
});

app.post('/api/customers', (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required'
      });
    }
    
    // Check if email already exists
    const existingCustomer = mockCustomers.find(c => c.email === email);
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    const newCustomer = {
      id: Math.max(...mockCustomers.map(c => c.id), 0) + 1,
      name,
      email,
      phone,
      address: address || '',
      created_at: new Date().toISOString().split('T')[0]
    };
    
    mockCustomers.push(newCustomer);
    
    res.status(201).json({
      success: true,
      data: newCustomer,
      message: 'Customer created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message
    });
  }
});

app.put('/api/customers/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = mockCustomers.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    const { name, email, phone, address } = req.body;
    
    // Check if email is being changed and if it already exists
    if (email && email !== mockCustomers[index].email) {
      const existingCustomer = mockCustomers.find(c => c.email === email);
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }
    
    mockCustomers[index] = {
      ...mockCustomers[index],
      name: name || mockCustomers[index].name,
      email: email || mockCustomers[index].email,
      phone: phone || mockCustomers[index].phone,
      address: address !== undefined ? address : mockCustomers[index].address
    };
    
    res.json({
      success: true,
      data: mockCustomers[index],
      message: 'Customer updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: error.message
    });
  }
});

app.delete('/api/customers/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = mockCustomers.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    const deletedCustomer = mockCustomers.splice(index, 1)[0];
    
    res.json({
      success: true,
      data: deletedCustomer,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error.message
    });
  }
});

// ===== MENU ROUTES =====
app.get('/api/menu', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockMenuItems,
      count: mockMenuItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
      error: error.message
    });
  }
});

app.get('/api/menu/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const menuItem = mockMenuItems.find(item => item.id === id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu item',
      error: error.message
    });
  }
});

app.post('/api/menu', (req, res) => {
  try {
    const { name, category, price, description, available } = req.body;
    
    // Validation
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required'
      });
    }
    
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }
    
    const newMenuItem = {
      id: Math.max(...mockMenuItems.map(item => item.id), 0) + 1,
      name,
      category,
      price: parseFloat(price),
      description: description || '',
      available: available !== undefined ? available : 1
    };
    
    mockMenuItems.push(newMenuItem);
    
    res.status(201).json({
      success: true,
      data: newMenuItem,
      message: 'Menu item created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create menu item',
      error: error.message
    });
  }
});

app.put('/api/menu/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = mockMenuItems.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    const { name, category, price, description, available } = req.body;
    
    // Validation for price if provided
    if (price !== undefined && price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }
    
    mockMenuItems[index] = {
      ...mockMenuItems[index],
      name: name || mockMenuItems[index].name,
      category: category || mockMenuItems[index].category,
      price: price !== undefined ? parseFloat(price) : mockMenuItems[index].price,
      description: description !== undefined ? description : mockMenuItems[index].description,
      available: available !== undefined ? available : mockMenuItems[index].available
    };
    
    res.json({
      success: true,
      data: mockMenuItems[index],
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message
    });
  }
});

app.delete('/api/menu/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = mockMenuItems.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    const deletedMenuItem = mockMenuItems.splice(index, 1)[0];
    
    res.json({
      success: true,
      data: deletedMenuItem,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item',
      error: error.message
    });
  }
});

// ===== ORDER ROUTES =====
app.get('/api/orders', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockOrders,
      count: mockOrders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const order = mockOrders.find(o => o.id === id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

app.get('/api/orders/customer/:customerId', (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId);
    const customerOrders = mockOrders.filter(order => order.customer_id === customerId);
    
    res.json({
      success: true,
      data: customerOrders,
      count: customerOrders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer orders',
      error: error.message
    });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { 
      customer_id, 
      customer_name, 
      customer_phone, 
      delivery_address, 
      items, 
      total_amount,
      status = 'Pending'
    } = req.body;
    
    // Validation
    if (!customer_id || !customer_name || !items || !items.length || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID, name, items, and total amount are required'
      });
    }
    
    if (total_amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total amount must be greater than 0'
      });
    }
    
    const newOrder = {
      id: Math.max(...mockOrders.map(o => o.id), 0) + 1,
      customer_id: parseInt(customer_id),
      customer_name,
      customer_phone: customer_phone || '',
      delivery_address: delivery_address || '',
      items: items.map(item => ({
        menu_item_id: item.menu_item_id,
        menu_item_name: item.menu_item_name,
        quantity: item.quantity,
        price: parseFloat(item.price),
        total_price: parseFloat(item.total_price)
      })),
      total_amount: parseFloat(total_amount),
      status,
      order_date: new Date().toISOString().split('T')[0]
    };
    
    mockOrders.push(newOrder);
    
    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

app.put('/api/orders/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = mockOrders.findIndex(o => o.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const { status, delivery_address, items, total_amount } = req.body;
    
    mockOrders[index] = {
      ...mockOrders[index],
      status: status || mockOrders[index].status,
      delivery_address: delivery_address !== undefined ? delivery_address : mockOrders[index].delivery_address,
      items: items || mockOrders[index].items,
      total_amount: total_amount !== undefined ? parseFloat(total_amount) : mockOrders[index].total_amount
    };
    
    res.json({
      success: true,
      data: mockOrders[index],
      message: 'Order updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = mockOrders.findIndex(o => o.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const deletedOrder = mockOrders.splice(index, 1)[0];
    
    res.json({
      success: true,
      data: deletedOrder,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
});

// ===== AUTH ROUTES (MOCK) =====
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Mock authentication - replace with real auth logic
    if (email === 'admin@tiffin.com' && password === 'admin123') {
      res.json({
        success: true,
        data: {
          id: 1,
          name: 'Admin User',
          email: 'admin@tiffin.com',
          role: 'admin',
          token: 'mock-jwt-token-admin'
        },
        message: 'Login successful'
      });
    } else if (email === 'user@tiffin.com' && password === 'user123') {
      res.json({
        success: true,
        data: {
          id: 2,
          name: 'Regular User',
          email: 'user@tiffin.com',
          role: 'user',
          token: 'mock-jwt-token-user'
        },
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    // Check if email already exists
    const existingCustomer = mockCustomers.find(c => c.email === email);
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    // Mock registration - replace with real logic
    const newUser = {
      id: Math.max(...mockCustomers.map(c => c.id), 0) + 1,
      name,
      email,
      phone: phone || '',
      address: address || '',
      role: 'user',
      created_at: new Date().toISOString().split('T')[0]
    };
    
    mockCustomers.push(newUser);
    
    res.status(201).json({
      success: true,
      data: {
        ...newUser,
        token: 'mock-jwt-token-user'
      },
      message: 'Registration successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    requested_path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Tiffin CRM Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Available endpoints:`);
  console.log(`   - GET/POST/PUT/DELETE /api/customers`);
  console.log(`   - GET/POST/PUT/DELETE /api/menu`);
  console.log(`   - GET/POST/PUT/DELETE /api/orders`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/register`);
});