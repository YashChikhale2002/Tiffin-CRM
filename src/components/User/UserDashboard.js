import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { menuAPI, orderAPI } from '../../services/api';

const UserDashboard = ({ showSuccess, showError, cart, setCart }) => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [menuRes, ordersRes] = await Promise.all([
        menuAPI.getAll(),
        orderAPI.getByCustomer(user.id).catch(() => ({ data: [] })) // Handle case where endpoint doesn't exist
      ]);
      setMenuItems(menuRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (error) {
      showError('Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category).filter(Boolean))];
  
  // Filter available items by category
  const filteredItems = selectedCategory === 'All' 
    ? menuItems.filter(item => item.available !== 0)
    : menuItems.filter(item => item.category === selectedCategory && item.available !== 0);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    showSuccess(`${item.name} added to cart! 🛒`);
  };

  const removeFromCart = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item && item.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const clearCart = () => {
    setCart([]);
    showSuccess('Cart cleared! 🧹');
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      showError('Please add items to cart first');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        customer_id: user.id,
        customer_name: user.name,
        customer_phone: user.phone || '0000000000',
        delivery_address: user.address || 'Address not provided',
        items: cart.map(item => ({
          menu_item_id: item.id,
          menu_item_name: item.name,
          quantity: item.quantity,
          price: item.price,
          total_price: item.price * item.quantity
        })),
        total_amount: getTotalAmount(),
        status: 'Pending',
        order_date: new Date().toISOString().split('T')[0]
      };

      await orderAPI.create(orderData);
      setCart([]);
      setShowCart(false);
      loadData();
      showSuccess('Order placed successfully! 🎉 We\'ll prepare your delicious meal soon!');
    } catch (error) {
      showError('Failed to place order. Please try again.');
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
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
      case 'Delivered': return '✅';
      case 'Pending': return '⏳';
      case 'Confirmed': return '✓';
      case 'Preparing': return '👨‍🍳';
      case 'Out for Delivery': return '🚚';
      case 'Cancelled': return '❌';
      default: return '📦';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Vegetarian': return '🥗';
      case 'Non-Vegetarian': return '🍖';
      case 'Beverage': return '🥤';
      case 'Dessert': return '🍰';
      case 'Snacks': return '🍿';
      default: return '🍽️';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Vegetarian': return 'bg-green-100';
      case 'Non-Vegetarian': return 'bg-red-100';
      case 'Beverage': return 'bg-blue-100';
      case 'Dessert': return 'bg-pink-100';
      case 'Snacks': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delicious food...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-orange-100 text-lg">Ready for some delicious food today?</p>
            <div className="mt-4 flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{orders.length}</div>
                <div className="text-orange-100 text-sm">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)}</div>
                <div className="text-orange-100 text-sm">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{getCartItemCount()}</div>
                <div className="text-orange-100 text-sm">Items in Cart</div>
              </div>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -mr-12 -mb-12"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Our Menu 🍽️</h2>
                <button
                  onClick={() => setShowCart(!showCart)}
                  className="lg:hidden bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m9.5-6v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  Cart ({getCartItemCount()})
                </button>
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-3 mb-8">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-full transition-all duration-200 flex items-center space-x-2 ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
                    }`}
                  >
                    {category !== 'All' && (
                      <span className="text-lg">{getCategoryIcon(category)}</span>
                    )}
                    <span className="font-medium">{category}</span>
                  </button>
                ))}
              </div>

              {/* Menu Items Grid */}
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No items available</h3>
                  <p className="text-gray-500">
                    {selectedCategory === 'All' 
                      ? 'No menu items are currently available' 
                      : `No items available in ${selectedCategory} category`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105">
                      <div className="flex items-center mb-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getCategoryColor(item.category)}`}>
                          <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium flex items-center space-x-2 hover:transform hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className={`lg:col-span-1 ${showCart ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Your Cart 🛒</h3>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🛒</div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h4>
                  <p className="text-gray-500 text-sm">Add some delicious items to get started!</p>
                </div>
              ) : (
                <div>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-600">₹{item.price} each</p>
                          </div>
                          <button
                            onClick={() => setCart(cart.filter(cartItem => cartItem.id !== item.id))}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="font-semibold text-lg">{item.quantity}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                          <span className="font-bold text-orange-600">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-bold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-orange-600">₹{getTotalAmount()}</span>
                    </div>
                    
                    <button
                      onClick={placeOrder}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 font-bold text-lg flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Placing Order...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Place Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Recent Orders 📦</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Place your first order to see it here!</p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.slice(0, 6).map(order => (
                <div key={order.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">{order.order_date || 'Date not available'}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      <span className="mr-1">{getStatusIcon(order.status)}</span>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="text-2xl font-bold text-orange-600 mb-3">
                    ₹{order.total_amount}
                  </div>
                  
                  {order.items && order.items.length > 0 ? (
                    <div className="text-sm text-gray-600 mb-4">
                      <p className="font-medium">{order.items.length} item{order.items.length !== 1 ? 's' : ''}:</p>
                      <div className="mt-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <span key={index} className="inline-block bg-white px-2 py-1 rounded mr-1 mb-1 text-xs">
                            {item.menu_item_name} x{item.quantity}
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-xs text-gray-500">+{order.items.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 mb-4">Order details not available</div>
                  )}

                  <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;