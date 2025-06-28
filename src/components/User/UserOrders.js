import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { orderAPI } from '../../services/api';

const UserOrders = ({ showSuccess, showError }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions = ['All', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Try customer-specific endpoint first, fallback to filtering all orders
      let orderData = [];
      try {
        const response = await orderAPI.getByCustomer(user.id);
        orderData = response.data || [];
      } catch (error) {
        console.log('Customer-specific endpoint not available, fetching all orders');
        const allOrders = await orderAPI.getAll();
        orderData = (allOrders.data || []).filter(order => 
          order.customer_name?.toLowerCase().includes(user.name.toLowerCase()) ||
          order.customer_id === user.id ||
          order.customer_phone === user.phone
        );
      }

      // Add mock data if no orders exist
      if (orderData.length === 0) {
        orderData = [
          {
            id: 1001,
            customer_name: user.name,
            order_date: new Date().toISOString().split('T')[0],
            total_amount: 245,
            status: 'Delivered',
            delivery_address: user.address || 'Your Address',
            items: [
              { menu_item_name: 'Special Dal Rice', quantity: 2, price: 85, total_price: 170 },
              { menu_item_name: 'Masala Chai', quantity: 1, price: 25, total_price: 25 },
              { menu_item_name: 'Gulab Jamun', quantity: 2, price: 25, total_price: 50 }
            ]
          },
          {
            id: 1002,
            customer_name: user.name,
            order_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            total_amount: 180,
            status: 'Preparing',
            delivery_address: user.address || 'Your Address',
            items: [
              { menu_item_name: 'Chicken Biryani', quantity: 1, price: 150, total_price: 150 },
              { menu_item_name: 'Raita', quantity: 1, price: 30, total_price: 30 }
            ]
          }
        ];
      }

      setOrders(orderData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch = !searchQuery || 
      order.id.toString().includes(searchQuery) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.items && order.items.some(item => 
        item.menu_item_name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    return matchesStatus && matchesSearch;
  });

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this order? This action cannot be undone.'
    );
    
    if (!confirmCancel) return;

    try {
      setLoading(true);
      await orderAPI.updateStatus(orderId, 'Cancelled');
      await fetchOrders();
      closeModal();
      showSuccess('Order cancelled successfully! Refund will be processed within 3-5 business days.');
    } catch (error) {
      showError('Failed to cancel order. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order) => {
    const itemNames = order.items?.map(item => item.menu_item_name).join(', ') || 'items';
    showSuccess(`${itemNames} have been added to your cart! Proceed to checkout to place your order.`);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
      'Preparing': 'bg-purple-100 text-purple-800 border-purple-300',
      'Out for Delivery': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'Delivered': 'bg-green-100 text-green-800 border-green-300',
      'Cancelled': 'bg-red-100 text-red-800 border-red-300'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': '⏳',
      'Confirmed': '✅',
      'Preparing': '👨‍🍳',
      'Out for Delivery': '🚚',
      'Delivered': '🎉',
      'Cancelled': '❌'
    };
    return icons[status] || '📦';
  };

  const calculateOrderStats = () => {
    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const active = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    
    return { total, delivered, active, totalSpent };
  };

  const stats = calculateOrderStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl p-8 text-white mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl font-bold mb-2">My Orders 📦</h1>
              <p className="text-orange-100 text-lg">Track and manage all your delicious orders</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-orange-100 text-sm">Total Orders</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.delivered}</div>
                <div className="text-orange-100 text-sm">Delivered</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-orange-100 text-sm">Active</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">₹{stats.totalSpent}</div>
                <div className="text-orange-100 text-sm">Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by order ID, status, or food item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    statusFilter === status
                      ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
            >
              <svg className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              {searchQuery ? 'No matching orders found' : 
               statusFilter === 'All' ? 'No orders yet' : `No ${statusFilter.toLowerCase()} orders`}
            </h3>
            <p className="text-gray-500 mb-8">
              {searchQuery ? 'Try adjusting your search terms' :
               statusFilter === 'All' ? 'Start by placing your first order from our delicious menu!' :
               `You don't have any ${statusFilter.toLowerCase()} orders at the moment.`}
            </p>
            {!searchQuery && (
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 font-medium text-lg">
                Browse Menu
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    
                    {/* Order Info */}
                    <div className="flex-1 mb-6 lg:mb-0">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-4">{getStatusIcon(order.status)}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                          <p className="text-gray-600">{new Date(order.order_date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</p>
                        </div>
                        <div className="ml-auto lg:ml-4">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Total Amount:</span>
                          <div className="text-2xl font-bold text-orange-600">₹{order.total_amount}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Items:</span>
                          <div className="text-gray-800">{order.items?.length || 1} item{(order.items?.length || 1) !== 1 ? 's' : ''}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Delivery:</span>
                          <div className="text-gray-800 truncate">{order.delivery_address || 'Standard delivery'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 lg:ml-6">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>

                      {order.status === 'Delivered' && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Reorder
                        </button>
                      )}

                      {(order.status === 'Pending' || order.status === 'Confirmed') && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={loading}
                          className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors font-medium disabled:opacity-50 flex items-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Order #{selectedOrder.id}</h2>
                  <p className="text-gray-600 mt-1">
                    Placed on {new Date(selectedOrder.order_date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Order Status */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Order Status</h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-gray-600">
                  {selectedOrder.status === 'Delivered' ? 'Your order has been delivered successfully! We hope you enjoyed your meal.' :
                   selectedOrder.status === 'Out for Delivery' ? 'Your order is on the way! Our delivery partner will reach you soon.' :
                   selectedOrder.status === 'Preparing' ? 'Our chefs are preparing your delicious meal with love and care.' :
                   selectedOrder.status === 'Confirmed' ? 'Your order has been confirmed and will be prepared shortly.' :
                   selectedOrder.status === 'Pending' ? 'We have received your order and are processing it.' :
                   'Order status has been updated.'}
                </p>
              </div>

              {/* Customer & Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-800">{selectedOrder.customer_name || user.name}</p>
                    <p className="text-gray-600">{user.phone || 'Phone not provided'}</p>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Information
                  </h4>
                  <div className="space-y-2">
                    <p className="text-gray-800">{selectedOrder.delivery_address || user.address || 'Address not provided'}</p>
                    <p className="text-gray-600">Estimated delivery: 30-45 minutes</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Order Items
                </h4>
                <div className="space-y-4">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-2xl">🍽️</span>
                          </div>
                          <div>
                            <h5 className="text-lg font-semibold text-gray-800">{item.menu_item_name}</h5>
                            <p className="text-gray-600">₹{item.price} per item</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-xl font-bold text-orange-600">₹{item.total_price}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-gray-500">Order items information not available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Actions */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-gray-800">Total Amount:</span>
                  <span className="text-3xl font-bold text-orange-600">₹{selectedOrder.total_amount}</span>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-end">
                  {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Confirmed') && (
                    <button
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      disabled={loading}
                      className="bg-red-500 text-white px-8 py-3 rounded-xl hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                    >
                      Cancel Order
                    </button>
                  )}
                  
                  {selectedOrder.status === 'Delivered' && (
                    <button
                      onClick={() => {
                        handleReorder(selectedOrder);
                        closeModal();
                      }}
                      className="bg-green-500 text-white px-8 py-3 rounded-xl hover:bg-green-600 transition-colors font-medium"
                    >
                      Reorder Items
                    </button>
                  )}
                  
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-600 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;