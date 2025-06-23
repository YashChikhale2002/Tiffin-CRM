import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data on app start
    const savedUser = localStorage.getItem('tiffin_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('tiffin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // Simulate API call
    const { email, password, type } = credentials;
    
    // Demo credentials
    const demoUsers = {
      admin: {
        email: 'admin@tiffin.com',
        password: 'admin123',
        type: 'admin',
        name: 'Admin User',
        id: 1
      },
      user: {
        email: 'user@tiffin.com',
        password: 'user123',
        type: 'user',
        name: 'John Doe',
        id: 2,
        phone: '9876543210',
        address: '123 Main St, City'
      }
    };

    const demoUser = Object.values(demoUsers).find(
      u => u.email === email && u.password === password && u.type === type
    );

    if (demoUser) {
      const userData = { ...demoUser };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('tiffin_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData) => {
    // Simulate API call for user registration
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      type: 'user'
    };

    setUser(newUser);
    localStorage.setItem('tiffin_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tiffin_user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('tiffin_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
    isAdmin: user?.type === 'admin',
    isUser: user?.type === 'user'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};