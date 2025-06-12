const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all orders with customer details
router.get('/', (req, res) => {
  const query = `
    SELECT o.id, o.customer_id, o.customer_name, o.total_amount, o.status, 
           o.order_date, o.delivery_address,
           datetime(o.created_at, 'localtime') as created_at,
           c.phone as customer_phone
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      data: rows
    });
  });
});

// Get single order with items
router.get('/:id', (req, res) => {
  const orderId = req.params.id;
  
  // Get order details
  const orderQuery = `
    SELECT o.id, o.customer_id, o.customer_name, o.total_amount, o.status, 
           o.order_date, o.delivery_address,
           datetime(o.created_at, 'localtime') as created_at,
           c.phone as customer_phone, c.address as customer_address
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ?
  `;
  
  db.get(orderQuery, [orderId], (err, order) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Get order items
    const itemsQuery = `
      SELECT oi.id, oi.menu_item_id, oi.menu_item_name, oi.quantity, oi.price,
             (oi.quantity * oi.price) as total_price
      FROM order_items oi
      WHERE oi.order_id = ?
    `;
    
    db.all(itemsQuery, [orderId], (err, items) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        success: true,
        data: {
          ...order,
          items: items || []
        }
      });
    });
  });
});

// Create new order
router.post('/', (req, res) => {
  const { customer_id, items, delivery_address } = req.body;
  
  // Validation
  if (!customer_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ 
      error: 'Customer ID and items array are required' 
    });
  }

  // Get customer details
  db.get('SELECT name, address FROM customers WHERE id = ?', [customer_id], (err, customer) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    // Calculate total amount and validate items
    let totalAmount = 0;
    let validItems = [];
    let itemsProcessed = 0;
    
    items.forEach((item, index) => {
      if (!item.menu_item_id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ 
          error: `Invalid item at index ${index}: menu_item_id and quantity are required` 
        });
      }

      // Get menu item details
      db.get('SELECT id, name, price, available FROM menu_items WHERE id = ?', 
             [item.menu_item_id], (err, menuItem) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        if (!menuItem) {
          res.status(404).json({ error: `Menu item with ID ${item.menu_item_id} not found` });
          return;
        }
        
        if (!menuItem.available) {
          res.status(400).json({ error: `Menu item "${menuItem.name}" is not available` });
          return;
        }

        validItems.push({
          menu_item_id: menuItem.id,
          menu_item_name: menuItem.name,
          quantity: item.quantity,
          price: menuItem.price
        });
        
        totalAmount += menuItem.price * item.quantity;
        itemsProcessed++;

        // If all items processed, create the order
        if (itemsProcessed === items.length) {
          createOrder();
        }
      });
    });

    function createOrder() {
      const orderData = {
        customer_id,
        customer_name: customer.name,
        total_amount: totalAmount,
        status: 'Pending',
        order_date: new Date().toISOString().split('T')[0],
        delivery_address: delivery_address || customer.address
      };

      // Insert order
      const orderQuery = `
        INSERT INTO orders (customer_id, customer_name, total_amount, status, order_date, delivery_address) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      db.run(orderQuery, [orderData.customer_id, orderData.customer_name, orderData.total_amount, 
                         orderData.status, orderData.order_date, orderData.delivery_address], 
             function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        const orderId = this.lastID;

        // Insert order items
        let itemsInserted = 0;
        validItems.forEach(item => {
          const itemQuery = `
            INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, price) 
            VALUES (?, ?, ?, ?, ?)
          `;
          
          db.run(itemQuery, [orderId, item.menu_item_id, item.menu_item_name, 
                            item.quantity, item.price], (err) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            
            itemsInserted++;
            if (itemsInserted === validItems.length) {
              res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: {
                  id: orderId,
                  ...orderData,
                  items: validItems
                }
              });
            }
          });
        });
      });
    }
  });
});

// Update order status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;
  
  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Status must be one of: ${validStatuses.join(', ')}` 
    });
  }

  // Check if order exists
  db.get('SELECT id FROM orders WHERE id = ?', [orderId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Update order status
    db.run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
           [status, orderId], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: {
          id: orderId,
          status
        }
      });
    });
  });
});

// Delete order
router.delete('/:id', (req, res) => {
  const orderId = req.params.id;
  
  // Check if order exists
  db.get('SELECT id FROM orders WHERE id = ?', [orderId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Delete order items first
    db.run('DELETE FROM order_items WHERE order_id = ?', [orderId], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Delete order
      db.run('DELETE FROM orders WHERE id = ?', [orderId], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({
          success: true,
          message: 'Order deleted successfully'
        });
      });
    });
  });
});

// Get orders by status
router.get('/status/:status', (req, res) => {
  const status = req.params.status;
  const query = `
    SELECT o.id, o.customer_id, o.customer_name, o.total_amount, o.status, 
           o.order_date, o.delivery_address,
           datetime(o.created_at, 'localtime') as created_at,
           c.phone as customer_phone
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.status = ?
    ORDER BY o.created_at DESC
  `;
  
  db.all(query, [status], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      data: rows
    });
  });
});

// Get orders by customer
router.get('/customer/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const query = `
    SELECT o.id, o.customer_id, o.customer_name, o.total_amount, o.status, 
           o.order_date, o.delivery_address,
           datetime(o.created_at, 'localtime') as created_at
    FROM orders o
    WHERE o.customer_id = ?
    ORDER BY o.created_at DESC
  `;
  
  db.all(query, [customerId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      data: rows
    });
  });
});

module.exports = router;