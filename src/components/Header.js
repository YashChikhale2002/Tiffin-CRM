import React from 'react';

const Header = () => {
  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">TiffinCRM</h1>
            <span className="text-primary-100">Tiffin Service Management</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, Admin</span>
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;