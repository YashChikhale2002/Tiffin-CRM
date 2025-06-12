const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all customers
router.get('/', (req, res) => {
  const query = `
    SELECT id, name, phone, address, plan, 
           datetime(created_at, 'localtime') as created_at 
    FROM customers 
    ORDER BY created_at DESC
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

// Get single customer
router.get('/:id', (req, res) => {
  const query = `
    SELECT id, name, phone, address, plan, 
           datetime(created_at, 'localtime') as created_at 
    FROM customers 
    WHERE id = ?
  `;
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json({
      success: true,
      data: row
    });
  });
});

// Create new customer
router.post('/', (req, res) => {
  const { name, phone, address, plan } = req.body;
  
  // Validation
  if (!name || !phone || !address || !plan) {
    return res.status(400).json({ 
      error: 'All fields are required: name, phone, address, plan' 
    });
  }

  // Check if phone number already exists
  db.get('SELECT id FROM customers WHERE phone = ?', [phone], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (row) {
      res.status(400).json({ error: 'Phone number already exists' });
      return;
    }

    // Insert new customer
    const query = `
      INSERT INTO customers (name, phone, address, plan) 
      VALUES (?, ?, ?, ?)
    `;
    
    db.run(query, [name, phone, address, plan], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: {
          id: this.lastID,
          name,
          phone,
          address,
          plan
        }
      });
    });
  });
});

// Update customer
router.put('/:id', (req, res) => {
  const { name, phone, address, plan } = req.body;
  const customerId = req.params.id;
  
  // Validation
  if (!name || !phone || !address || !plan) {
    return res.status(400).json({ 
      error: 'All fields are required: name, phone, address, plan' 
    });
  }

  // Check if customer exists
  db.get('SELECT id FROM customers WHERE id = ?', [customerId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    // Check if phone number already exists for other customers
    db.get('SELECT id FROM customers WHERE phone = ? AND id != ?', [phone, customerId], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (row) {
        res.status(400).json({ error: 'Phone number already exists' });
        return;
      }

      // Update customer
      const query = `
        UPDATE customers 
        SET name = ?, phone = ?, address = ?, plan = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      db.run(query, [name, phone, address, plan, customerId], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({
          success: true,
          message: 'Customer updated successfully',
          data: {
            id: customerId,
            name,
            phone,
            address,
            plan
          }
        });
      });
    });
  });
});

// Delete customer
router.delete('/:id', (req, res) => {
  const customerId = req.params.id;
  
  // Check if customer exists
  db.get('SELECT id FROM customers WHERE id = ?', [customerId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    // Check if customer has orders
    db.get('SELECT COUNT(*) as orderCount FROM orders WHERE customer_id = ?', [customerId], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (result.orderCount > 0) {
        res.status(400).json({ error: 'Cannot delete customer with existing orders' });
        return;
      }

      // Delete customer
      db.run('DELETE FROM customers WHERE id = ?', [customerId], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({
          success: true,
          message: 'Customer deleted successfully'
        });
      });
    });
  });
});

// Search customers
router.get('/search/:term', (req, res) => {
  const searchTerm = `%${req.params.term}%`;
  const query = `
    SELECT id, name, phone, address, plan, 
           datetime(created_at, 'localtime') as created_at 
    FROM customers 
    WHERE name LIKE ? OR phone LIKE ? OR address LIKE ?
    ORDER BY created_at DESC
  `;
  
  db.all(query, [searchTerm, searchTerm, searchTerm], (err, rows) => {
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