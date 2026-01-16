import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mytrouvepro_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      // In production, this would call your backend API
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        verified: false,
        profileComplete: false,
        termsAccepted: userData.termsAccepted || false,
        termsAcceptedAt: userData.termsAccepted ? new Date().toISOString() : null,
        // Provider-specific fields
        ...(userData.role === 'provider' && {
          commission: 10, // 10% commission
          earnings: 0,
          pendingEarnings: 0,
          totalBookings: 0,
          rating: 0,
          reviews: [],
          services: [],
          availability: [],
          contactHidden: true, // Contact info hidden until booking is paid
          profilePublished: false, // Profile not published by default
          bankAccount: null, // Provider's bank account for payouts
          photos: [],
        }),
        // Seeker-specific fields
        ...(userData.role === 'seeker' && {
          bookings: [],
          favorites: [],
        }),
      };

      // Save to localStorage (in production, save to database)
      localStorage.setItem('mytrouvepro_user', JSON.stringify(newUser));

      // Save to users list
      const users = JSON.parse(localStorage.getItem('mytrouvepro_users') || '[]');
      users.push(newUser);
      localStorage.setItem('mytrouvepro_users', JSON.stringify(users));

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      // In production, validate with backend
      const users = JSON.parse(localStorage.getItem('mytrouvepro_users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (foundUser) {
        localStorage.setItem('mytrouvepro_user', JSON.stringify(foundUser));
        setUser(foundUser);
        return { success: true, user: foundUser };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('mytrouvepro_user');
    setUser(null);
  };

  // Update user profile
  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('mytrouvepro_user', JSON.stringify(updatedUser));

    // Update in users list
    const users = JSON.parse(localStorage.getItem('mytrouvepro_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('mytrouvepro_users', JSON.stringify(users));
    }

    setUser(updatedUser);
  };

  // Add service (for providers)
  const addService = (service) => {
    if (user?.role !== 'provider') return;
    const updatedServices = [...(user.services || []), { id: Date.now().toString(), ...service }];
    updateProfile({ services: updatedServices });
  };

  // Remove service (for providers)
  const removeService = (serviceId) => {
    if (user?.role !== 'provider') return;
    const updatedServices = user.services.filter(s => s.id !== serviceId);
    updateProfile({ services: updatedServices });
  };

  // Toggle profile published status (for providers)
  const toggleProfilePublished = () => {
    if (user?.role !== 'provider') return;
    updateProfile({ profilePublished: !user.profilePublished });
  };

  // Convert seeker to provider
  const becomeProvider = async (providerData) => {
    if (user?.role !== 'seeker') return { success: false, error: 'Only seekers can become providers' };

    const updatedUser = {
      ...user,
      role: 'provider',
      ...providerData,
      commission: 10,
      earnings: 0,
      pendingEarnings: 0,
      totalBookings: 0,
      rating: 0,
      reviews: [],
      services: [],
      availability: [],
      contactHidden: true,
      profilePublished: false,
      bankAccount: null,
      photos: [],
      becameProviderAt: new Date().toISOString(),
    };

    localStorage.setItem('mytrouvepro_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('mytrouvepro_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('mytrouvepro_users', JSON.stringify(users));
    }

    setUser(updatedUser);
    return { success: true, user: updatedUser };
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
      toggleProfilePublished,
      becomeProvider,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
