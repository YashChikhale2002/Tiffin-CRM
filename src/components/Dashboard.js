import React from 'react';

const Dashboard = ({ customers = [], orders = [], menuItems = [] }) => {
  // Safe calculation of total revenue with multiple fallbacks
  const totalRevenue = orders.reduce((sum, order) => {
    if (!order) return sum;
    
    // Handle API data (total_amount as number)
    if (typeof order.total_amount === 'number') {
      return sum + order.total_amount;
    }
    
    // Handle string numbers
    if (typeof order.total_amount === 'string') {
      const amount = parseFloat(order.total_amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }
    
    // Handle legacy format with ₹ symbol
    if (order.amount && typeof order.amount === 'string') {
      const amount = parseFloat(order.amount.replace(/[₹,]/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }
    
    return sum;
  }, 0);

  // Safe calculation of pending orders
  const pendingOrders = orders.filter(order => 
    order && order.status === 'Pending'
  ).length;

  // Safe stats calculation
  const stats = {
    totalCustomers: customers.length || 0,
    totalOrders: orders.length || 0,
    pendingOrders: pendingOrders || 0,
    totalRevenue: totalRevenue || 0
  };

  // Safe recent orders (limit to 5)
  const recentOrders = orders.slice(0, 5);

  // Safe menu items (limit to 5) 
  const displayMenuItems = menuItems.slice(0, 5);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalCustomers}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.pendingOrders}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd className="text-lg font-medium text-gray-900">₹{stats.totalRevenue.toLocaleString('en-IN')}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                if (!order) return null;
                
                // Safe amount extraction
                let displayAmount = '₹0';
                if (typeof order.total_amount === 'number') {
                  displayAmount = `₹${order.total_amount}`;
                } else if (typeof order.total_amount === 'string') {
                  const amount = parseFloat(order.total_amount);
                  displayAmount = `₹${isNaN(amount) ? 0 : amount}`;
                } else if (order.amount && typeof order.amount === 'string') {
                  displayAmount = order.amount.startsWith('₹') ? order.amount : `₹${order.amount}`;
                }

                return (
                  <div key={order.id || Math.random()} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.customer_name || order.customer || 'Unknown Customer'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.order_date || order.date || 'No date'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{displayAmount}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Out for Delivery' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Menu Items</h3>
          <div className="space-y-4">
            {displayMenuItems.length > 0 ? (
              displayMenuItems.map((item) => {
                if (!item) return null;
                
                // Safe price extraction
                let displayPrice = '₹0';
                if (typeof item.price === 'number') {
                  displayPrice = `₹${item.price}`;
                } else if (typeof item.price === 'string') {
                  if (item.price.startsWith('₹')) {
                    displayPrice = item.price;
                  } else {
                    const price = parseFloat(item.price);
                    displayPrice = `₹${isNaN(price) ? 0 : price}`;
                  }
                }

                return (
                  <div key={item.id || Math.random()} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">{item.name || 'Unknown Item'}</p>
                      <p className="text-sm text-gray-600">{item.category || 'No category'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{displayPrice}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.available === true || item.available === 1 || item.available === undefined ? 
                        'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.available === false || item.available === 0 ? 'Unavailable' : 'Available'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No menu items yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;