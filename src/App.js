import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import OrderList from './components/OrderList';
import MenuManagement from './components/MenuManagement';
import AddCustomer from './components/AddCustomer';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import { customerAPI, menuAPI, orderAPI } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Toast system
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [customersRes, ordersRes, menuRes] = await Promise.all([
        customerAPI.getAll(),
        orderAPI.getAll(),
        menuAPI.getAll()
      ]);
      
      setCustomers(customersRes.data || []);
      setOrders(ordersRes.data || []);
      setMenuItems(menuRes.data || []);
      
      if (activeTab === 'dashboard') {
        showInfo('Dashboard data loaded successfully!');
      }
    } catch (err) {
      setError('Failed to load data. Please make sure the server is running.');
      showError('Failed to load data. Please check your connection.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data || []);
      showSuccess('Customer list refreshed!');
    } catch (err) {
      showError('Failed to refresh customers');
      console.error('Error refreshing customers:', err);
    }
  };

  const refreshOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data || []);
      showSuccess('Orders refreshed!');
    } catch (err) {
      showError('Failed to refresh orders');
      console.error('Error refreshing orders:', err);
    }
  };

  const refreshMenu = async () => {
    try {
      const response = await menuAPI.getAll();
      setMenuItems(response.data || []);
      showSuccess('Menu refreshed!');
    } catch (err) {
      showError('Failed to refresh menu');
      console.error('Error refreshing menu:', err);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      await customerAPI.create(customerData);
      await refreshCustomers();
      showSuccess(`Customer "${customerData.name}" added successfully! 🎉`);
      return true;
    } catch (err) {
      showError('Failed to add customer: ' + err.message);
      console.error('Error adding customer:', err);
      throw err;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadAllData}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard customers={customers} orders={orders} menuItems={menuItems} />;
      case 'customers':
        return (
          <CustomerList 
            customers={customers} 
            onRefresh={refreshCustomers}
            showSuccess={showSuccess}
            showError={showError}
          />
        );
      case 'orders':
        return (
          <OrderList 
            orders={orders} 
            onRefresh={refreshOrders}
            showSuccess={showSuccess}
            showError={showError}
          />
        );
      case 'menu':
        return (
          <MenuManagement 
            menuItems={menuItems} 
            onRefresh={refreshMenu}
            showSuccess={showSuccess}
            showError={showError}
          />
        );
      case 'add-customer':
        return (
          <AddCustomer 
            onAddCustomer={addCustomer} 
            setActiveTab={setActiveTab}
            showSuccess={showSuccess}
            showError={showError}
          />
        );
      default:
        return <Dashboard customers={customers} orders={orders} menuItems={menuItems} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;