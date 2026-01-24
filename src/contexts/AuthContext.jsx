import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('mytrouvepro_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        verified: false,
        profileComplete: false,
        ...(userData.role === 'provider' && {
          commission: 10,
          earnings: 0,
          totalBookings: 0,
          rating: 0,
          reviews: [],
          services: [],
          availability: [],
          contactHidden: true,
        }),
        ...(userData.role === 'seeker' && {
          bookings: [],
          favorites: [],
        }),
      };

      localStorage.setItem('mytrouvepro_user', JSON.stringify(newUser));

      const users = JSON.parse(localStorage.getItem('mytrouvepro_users') || '[]');
      users.push(newUser);
      localStorage.setItem('mytrouvepro_users', JSON.stringify(users));

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('mytrouvepro_users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (foundUser) {
        localStorage.setItem('mytrouvepro_user', JSON.stringify(foundUser));
        setUser(foundUser);
        return { success: true, user: foundUser };
      }
      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('mytrouvepro_user');
    setUser(null);
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('mytrouvepro_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('mytrouvepro_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('mytrouvepro_users', JSON.stringify(users));
    }

    setUser(updatedUser);
  };

  const addService = (service) => {
    if (user?.role !== 'provider') return { success: false };
    const updatedServices = [...(user.services || []), { id: Date.now().toString(), ...service }];
    updateProfile({ services: updatedServices });
    return { success: true };
  };

  const removeService = (serviceId) => {
    if (user?.role !== 'provider') return;
    const updatedServices = (user.services || []).filter(s => s.id !== serviceId);
    updateProfile({ services: updatedServices });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      isProvider: user?.role === 'provider',
      isSeeker: user?.role === 'seeker',
      register,
      login,
      logout,
      updateProfile,
      addService,
      removeService,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
