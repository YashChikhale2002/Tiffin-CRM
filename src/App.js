import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import OrderList from './components/OrderList';
import MenuManagement from './components/MenuManagement';
import AddCustomer from './components/AddCustomer';
import { customerAPI, menuAPI, orderAPI } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError('Failed to load data. Please make sure the server is running.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data || []);
    } catch (err) {
      console.error('Error refreshing customers:', err);
    }
  };

  const refreshOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error refreshing orders:', err);
    }
  };

  const refreshMenu = async () => {
    try {
      const response = await menuAPI.getAll();
      setMenuItems(response.data || []);
    } catch (err) {
      console.error('Error refreshing menu:', err);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      await customerAPI.create(customerData);
      await refreshCustomers();
      return true;
    } catch (err) {
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
        return <CustomerList customers={customers} onRefresh={refreshCustomers} />;
      case 'orders':
        return <OrderList orders={orders} onRefresh={refreshOrders} />;
      case 'menu':
        return <MenuManagement menuItems={menuItems} onRefresh={refreshMenu} />;
      case 'add-customer':
        return <AddCustomer onAddCustomer={addCustomer} setActiveTab={setActiveTab} />;
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
    </div>
  );
}

export default App;