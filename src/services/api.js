const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Customer API
export const customerAPI = {
  // Get all customers
  getAll: () => apiCall('/customers'),
  
  // Get single customer
  getById: (id) => apiCall(`/customers/${id}`),
  
  // Create new customer
  create: (customerData) => apiCall('/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  }),
  
  // Update customer
  update: (id, customerData) => apiCall(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customerData),
  }),
  
  // Delete customer
  delete: (id) => apiCall(`/customers/${id}`, {
    method: 'DELETE',
  }),
  
  // Search customers
  search: (term) => apiCall(`/customers/search/${encodeURIComponent(term)}`),
};

// Menu API
export const menuAPI = {
  // Get all menu items
  getAll: () => apiCall('/menu'),
  
  // Get available menu items only
  getAvailable: () => apiCall('/menu/available'),
  
  // Get single menu item
  getById: (id) => apiCall(`/menu/${id}`),
  
  // Create new menu item
  create: (menuData) => apiCall('/menu', {
    method: 'POST',
    body: JSON.stringify(menuData),
  }),
  
  // Update menu item
  update: (id, menuData) => apiCall(`/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(menuData),
  }),
  
  // Delete menu item
  delete: (id) => apiCall(`/menu/${id}`, {
    method: 'DELETE',
  }),
  
  // Toggle availability
  toggleAvailability: (id) => apiCall(`/menu/${id}/toggle-availability`, {
    method: 'PATCH',
  }),
  
  // Get by category
  getByCategory: (category) => apiCall(`/menu/category/${encodeURIComponent(category)}`),
};

// Order API
export const orderAPI = {
  // Get all orders
  getAll: () => apiCall('/orders'),
  
  // Get single order with items
  getById: (id) => apiCall(`/orders/${id}`),
  
  // Create new order
  create: (orderData) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  // Update order status
  updateStatus: (id, status) => apiCall(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  // Delete order
  delete: (id) => apiCall(`/orders/${id}`, {
    method: 'DELETE',
  }),
  
  // Get orders by status
  getByStatus: (status) => apiCall(`/orders/status/${encodeURIComponent(status)}`),
  
  // Get orders by customer
  getByCustomer: (customerId) => apiCall(`/orders/customer/${customerId}`),
};

// Dashboard API
export const dashboardAPI = {
  // Get dashboard stats
  getStats: async () => {
    try {
      const [customers, orders, menu] = await Promise.all([
        customerAPI.getAll(),
        orderAPI.getAll(),
        menuAPI.getAll(),
      ]);
      
      const totalCustomers = customers.data.length;
      const totalOrders = orders.data.length;
      const pendingOrders = orders.data.filter(order => order.status === 'Pending').length;
      const totalRevenue = orders.data.reduce((sum, order) => sum + order.total_amount, 0);
      
      return {
        success: true,
        data: {
          totalCustomers,
          totalOrders,
          pendingOrders,
          totalRevenue,
          recentOrders: orders.data.slice(0, 5),
          popularMenuItems: menu.data.slice(0, 5),
        }
      };
    } catch (error) {
      throw error;
    }
  },
};

// Health check
export const healthCheck = () => apiCall('/health');