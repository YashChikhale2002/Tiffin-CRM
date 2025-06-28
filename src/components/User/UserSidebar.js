import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserSidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 5,
    favoriteFood: 'Dal Rice',
    memberSince: 'Jan 2024',
    totalSpent: 1250,
    activeOrders: 2
  });

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
        </svg>
      ),
      description: 'Overview & Quick Actions'
    },
    {
      id: 'menu',
      name: 'Browse Menu',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      description: 'Explore delicious food'
    },
    {
      id: 'orders',
      name: 'My Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      description: 'Track your orders',
      badge: stats.activeOrders > 0 ? stats.activeOrders : null
    },
    {
      id: 'profile',
      name: 'My Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'Account settings'
    },
    {
      id: 'support',
      name: 'Help & Support',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      description: 'Get help & support'
    }
  ];

  // Update stats based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let greeting = 'Good day';
      if (hour < 12) greeting = 'Good morning';
      else if (hour < 17) greeting = 'Good afternoon';
      else greeting = 'Good evening';
      
      setStats(prev => ({ ...prev, greeting }));
    };
    
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getActiveItemsCount = () => {
    // Mock active items count
    return ['dashboard', 'menu'].includes(activeTab) ? 0 : stats.activeOrders;
  };

  return (
    <div className="bg-white w-72 min-h-screen shadow-xl border-r border-gray-200 flex flex-col">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm">
                <span className="text-white text-xl font-bold">🍱</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">TiffinCRM</h3>
                <p className="text-orange-100 text-sm">Customer Portal</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-orange-100 text-sm">{stats.greeting || 'Hello'},</p>
              <h4 className="font-bold text-lg">{user.name.split(' ')[0]}!</h4>
              <p className="text-orange-200 text-xs">Ready for delicious food?</p>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group relative overflow-hidden rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-gray-50 hover:transform hover:scale-102'
              }`}
            >
              <div className="flex items-center p-4">
                <div className={`mr-4 transition-colors ${
                  activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-orange-500'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{item.name}</span>
                    {item.badge && (
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                        activeTab === item.id 
                          ? 'bg-white bg-opacity-20 text-white' 
                          : 'bg-orange-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${
                    activeTab === item.id ? 'text-orange-100' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
              
              {/* Active indicator */}
              {activeTab === item.id && (
                <div className="absolute inset-0 bg-white bg-opacity-10 pointer-events-none"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Stats Section */}
      <div className="p-6 border-t border-gray-100">
        <div className="bg-gray-50 rounded-2xl p-5">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
            </svg>
            Quick Stats
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm">📦</span>
                </div>
                <span className="text-sm text-gray-600">Total Orders</span>
              </div>
              <span className="font-bold text-blue-600">{stats.totalOrders}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm">💰</span>
                </div>
                <span className="text-sm text-gray-600">Total Spent</span>
              </div>
              <span className="font-bold text-green-600">₹{stats.totalSpent}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 text-sm">❤️</span>
                </div>
                <span className="text-sm text-gray-600">Favorite</span>
              </div>
              <span className="font-bold text-purple-600 text-xs">{stats.favoriteFood}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-orange-600 text-sm">📅</span>
                </div>
                <span className="text-sm text-gray-600">Member Since</span>
              </div>
              <span className="font-bold text-orange-600 text-xs">{stats.memberSince}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Special Offer Section */}
      <div className="p-6 pt-0">
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center">
              <div className="text-3xl mb-3">🎉</div>
              <h4 className="font-bold text-lg mb-2">Special Offer!</h4>
              <p className="text-yellow-100 text-sm mb-4">Get 20% off on orders above ₹500</p>
              <button 
                onClick={() => setActiveTab('menu')}
                className="bg-white text-orange-600 text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105"
              >
                Order Now
              </button>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-white bg-opacity-20 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute top-1/2 right-0 w-8 h-8 bg-white bg-opacity-10 rounded-full"></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 pt-0 pb-8">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveTab('orders')}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-xl transition-colors text-center"
          >
            <div className="text-lg mb-1">🚚</div>
            <div className="text-xs font-medium">Track Orders</div>
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className="bg-green-50 hover:bg-green-100 text-green-700 p-3 rounded-xl transition-colors text-center"
          >
            <div className="text-lg mb-1">💬</div>
            <div className="text-xs font-medium">Get Help</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;