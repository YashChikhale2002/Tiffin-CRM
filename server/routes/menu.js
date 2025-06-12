const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all menu items
router.get('/', (req, res) => {
  const query = `
    SELECT id, name, price, category, available,
           datetime(created_at, 'localtime') as created_at 
    FROM menu_items 
    ORDER BY category, name
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

// Get available menu items only
router.get('/available', (req, res) => {
  const query = `
    SELECT id, name, price, category, available,
           datetime(created_at, 'localtime') as created_at 
    FROM menu_items 
    WHERE available = 1
    ORDER BY category, name
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

// Get single menu item
router.get('/:id', (req, res) => {
  const query = `
    SELECT id, name, price, category, available,
           datetime(created_at, 'localtime') as created_at 
    FROM menu_items 
    WHERE id = ?
  `;
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }
    res.json({
      success: true,
      data: row
    });
  });
});

// Create new menu item
router.post('/', (req, res) => {
  const { name, price, category, available = 1 } = req.body;
  
  // Validation
  if (!name || !price || !category) {
    return res.status(400).json({ 
      error: 'Name, price, and category are required' 
    });
  }

  if (price <= 0) {
    return res.status(400).json({ 
      error: 'Price must be greater than 0' 
    });
  }

  // Check if menu item already exists
  db.get('SELECT id FROM menu_items WHERE name = ? AND category = ?', [name, category], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (row) {
      res.status(400).json({ error: 'Menu item with this name already exists in this category' });
      return;
    }

    // Insert new menu item
    const query = `
      INSERT INTO menu_items (name, price, category, available) 
      VALUES (?, ?, ?, ?)
    `;
    
    db.run(query, [name, price, category, available], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.status(201).json({
        success: true,
        message: 'Menu item created successfully',
        data: {
          id: this.lastID,
          name,
          price,
          category,
          available
        }
      });
    });
  });
});

// Update menu item
router.put('/:id', (req, res) => {
  const { name, price, category, available } = req.body;
  const itemId = req.params.id;
  
  // Validation
  if (!name || !price || !category) {
    return res.status(400).json({ 
      error: 'Name, price, and category are required' 
    });
  }

  if (price <= 0) {
    return res.status(400).json({ 
      error: 'Price must be greater than 0' 
    });
  }

  // Check if menu item exists
  db.get('SELECT id FROM menu_items WHERE id = ?', [itemId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    // Check if another item with same name exists in same category
    db.get('SELECT id FROM menu_items WHERE name = ? AND category = ? AND id != ?', [name, category, itemId], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (row) {
        res.status(400).json({ error: 'Menu item with this name already exists in this category' });
        return;
      }

      // Update menu item
      const query = `
        UPDATE menu_items 
        SET name = ?, price = ?, category = ?, available = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      db.run(query, [name, price, category, available, itemId], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({
          success: true,
          message: 'Menu item updated successfully',
          data: {
            id: itemId,
            name,
            price,
            category,
            available
          }
        });
      });
    });
  });
});

// Delete menu item
router.delete('/:id', (req, res) => {
  const itemId = req.params.id;
  
  // Check if menu item exists
  db.get('SELECT id FROM menu_items WHERE id = ?', [itemId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    // Delete menu item
    db.run('DELETE FROM menu_items WHERE id = ?', [itemId], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        success: true,
        message: 'Menu item deleted successfully'
      });
    });
  });
});

// Toggle availability
router.patch('/:id/toggle-availability', (req, res) => {
  const itemId = req.params.id;
  
  // Get current availability status
  db.get('SELECT available FROM menu_items WHERE id = ?', [itemId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    const newAvailability = row.available ? 0 : 1;
    
    // Update availability
    db.run('UPDATE menu_items SET available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
           [newAvailability, itemId], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        success: true,
        message: `Menu item ${newAvailability ? 'enabled' : 'disabled'} successfully`,
        data: {
          id: itemId,
          available: newAvailability
        }
      });
    });
  });
});

module.exports = router;