import React from 'react';

const UserSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Menu & Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'orders',
      name: 'My Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'profile',
      name: 'My Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg border-r border-gray-200">
      <div className="p-6">
        {/* User Info */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg font-bold">🍱</span>
            </div>
            <div>
              <h3 className="font-semibold">Customer Portal</h3>
              <p className="text-orange-100 text-sm">Order delicious food</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={`mr-3 ${activeTab === item.id ? 'text-white' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Quick Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="font-semibold text-orange-600">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Favorite Food</span>
              <span className="font-semibold text-gray-800">Dal Rice</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Member Since</span>
              <span className="font-semibold text-gray-800">Jan 2024</span>
            </div>
          </div>
        </div>

        {/* Special Offer */}
        <div className="mt-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 text-white">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <h4 className="font-bold text-sm mb-1">Special Offer!</h4>
            <p className="text-xs text-yellow-100 mb-3">Get 20% off on orders above ₹500</p>
            <button className="bg-white text-orange-600 text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;