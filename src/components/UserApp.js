import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer } from './Toast';
import { useToast } from '../hooks/useToast';
import UserHeader from './User/UserHeader';
import UserSidebar from './User/UserSidebar';
import UserDashboard from './User/UserDashboard';
import UserOrders from './User/UserOrders';
import UserProfile from './User/UserProfile';
import UserMenu from './User/UserMenu';
import UserSupport from './User/UserSupport';

const UserApp = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cart, setCart] = useState([]);
  
  // Toast system
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <UserDashboard 
            showSuccess={showSuccess}
            showError={showError}
            cart={cart}
            setCart={setCart}
            setActiveTab={setActiveTab}
          />
        );
      case 'menu':
        return (
          <UserMenu 
            showSuccess={showSuccess}
            showError={showError}
            cart={cart}
            setCart={setCart}
          />
        );
      case 'orders':
        return (
          <UserOrders 
            showSuccess={showSuccess}
            showError={showError}
          />
        );
      case 'profile':
        return (
          <UserProfile 
            showSuccess={showSuccess}
            showError={showError}
          />
        );
      case 'support':
        return (
          <UserSupport 
            showSuccess={showSuccess}
            showError={showError}
          />
        );
      default:
        return (
          <UserDashboard 
            showSuccess={showSuccess}
            showError={showError}
            cart={cart}
            setCart={setCart}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed width */}
      <div className="w-72 flex-shrink-0">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <UserHeader cart={cart} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default UserApp;