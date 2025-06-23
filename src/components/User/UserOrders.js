import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { orderAPI } from '../../services/api';

const UserOrders = ({ showSuccess, showError }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const statuses = ['All', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getByCustomer(user.id);
      setOrders(response.data || []);
    } catch (error) {
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'All' || order.status === statusFilter
  );

  const viewOrderDetails = async (order) => {
    try {
      const response = await orderAPI.getById(order.id);
      setSelectedOrder(response.data);
      setShowOrderDetails(true);
    } catch (error) {
      // If detailed API fails, use the basic order data
      setSelectedOrder(order);
      setShowOrderDetails(true);
    }
  };

  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.updateStatus(orderId, 'Cancelled');
        loadOrders();
        showSuccess('Order cancelled successfully! ❌');
      } catch (error) {
        showError('Failed to cancel order');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Out for Delivery': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return '✅';
      case 'Pending':
        return '⏳';
      case 'Confirmed':
        return '✓';
      case 'Preparing':
        return '👨‍🍳';
      case 'Out for Delivery':
        return '🚚';
      case 'Cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders 📦</h1>
          <button
            onClick={loadOrders}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  statusFilter === status
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {statusFilter === 'All' ? 'No orders yet' : `No ${statusFilter.toLowerCase()} orders`}
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter === 'All' 
                ? 'Start by browsing our delicious menu!' 
                : `You don't have any ${statusFilter.toLowerCase()} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 mr-3">
                        Order #{order.id}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        <span className="mr-1">{getStatusIcon(order.status)}</span>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Date:</span>
                        <div>{order.order_date || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="font-medium">Total:</span>
                        <div className="text-lg font-bold text-orange-600">₹{order.total_amount}</div>
                      </div>
                      <div>
                        <span className="font-medium">Items:</span>
                        <div>{order.items ? order.items.length : 'N/A'} item{order.items && order.items.length !== 1 ? 's' : ''}</div>
                      </div>
                      <div>
                        <span className="font-medium">Delivery:</span>
                        <div className="truncate">{order.delivery_address || user.address}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      View Details
                    </button>
                    {(order.status === 'Pending' || order.status === 'Confirmed') && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Order #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Order Status */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-700">Current Status</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(selectedOrder.status)}`}>
                      <span className="mr-1">{getStatusIcon(selectedOrder.status)}</span>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <h4 className="font-semibold text-gray-700">Order Date</h4>
                    <p className="text-gray-600 mt-1">{selectedOrder.order_date}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Delivery Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{selectedOrder.delivery_address || user.address}</p>
                  <p className="text-gray-600 text-sm mt-1">Phone: {user.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
                        <div>
                          <h5 className="font-medium text-gray-800">{item.menu_item_name}</h5>
                          <p className="text-sm text-gray-600">₹{item.price} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Qty: {item.quantity}</p>
                          <p className="text-orange-600 font-semibold">₹{item.total_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-orange-600">₹{selectedOrder.total_amount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Confirmed') && (
                  <button
                    onClick={() => {
                      cancelOrder(selectedOrder.id);
                      setShowOrderDetails(false);
                    }}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;