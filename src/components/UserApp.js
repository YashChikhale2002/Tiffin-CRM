import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer } from './Toast';
import { useToast } from '../hooks/useToast';
import UserHeader from './User/UserHeader';
import UserSidebar from './User/UserSidebar';
import UserDashboard from './User/UserDashboard';
import UserOrders from './User/UserOrders';
import UserProfile from './User/UserProfile';

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
      default:
        return (
          <UserDashboard 
            showSuccess={showSuccess}
            showError={showError}
            cart={cart}
            setCart={setCart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader cart={cart} />
      <div className="flex">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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