import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, signUp, signIn, signOut, getCurrentUser, db } from './supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        await loadUserProfile(currentUser.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data: userData, error: userError } = await db.getUser(userId);
      
      if (userError) throw userError;
      
      // Normalize user data (snake_case to camelCase)
      let normalizedUser = {
        ...userData,
        firstName: userData.first_name,
        lastName: userData.last_name,
      };
      
      // Load provider profile if provider
      if (userData.role === 'provider') {
        const { data: providerData } = await db.getProviderProfile(userId);
        setProfile(providerData);
        
        // Merge into user object for convenience
        if (providerData) {
          normalizedUser = {
            ...normalizedUser,
            ...providerData,
            businessName: providerData.business_name,
            businessDescription: providerData.business_description,
          };
        }
      }
      
      setUser(normalizedUser);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      const { 
        email, 
        password, 
        role, 
        firstName, 
        lastName, 
        phone, 
        city, 
        businessName, 
        description, 
        category 
      } = userData;
      
      // Create auth user
      const { data: authData, error: authError } = await signUp(email, password, {
        role,
        first_name: firstName,
        last_name: lastName,
        phone,
        city
      });
      
      if (authError) throw authError;
      
      // Create user record
      const dbUserPayload = {
        id: authData.user.id,
        email,
        role,
        first_name: firstName,
        last_name: lastName,
        phone,
        city,
        verified: false,
        profile_complete: false
      };

      const { data: newUser, error: userError } = await db.createUser(dbUserPayload);
      
      if (userError) throw userError;
      
      // Create provider profile if provider
      if (role === 'provider') {
        await db.createProviderProfile({
          user_id: authData.user.id,
          business_name: businessName,
          business_description: description,
          commission_rate: 10.00,
          contact_hidden: true
        });
      }
      
      const normalizedUser = {
        ...newUser,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
      };

      if (role === 'provider') {
        normalizedUser.businessName = businessName;
        normalizedUser.businessDescription = description;
      }
      
      setUser(normalizedUser);
      
      return { success: true, user: normalizedUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) throw error;
      
      await loadUserProfile(data.user.id);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      // Map updates to snake_case
      const dbUpdates = { ...updates };
      if (updates.firstName) {
        dbUpdates.first_name = updates.firstName;
        delete dbUpdates.firstName;
      }
      if (updates.lastName) {
        dbUpdates.last_name = updates.lastName;
        delete dbUpdates.lastName;
      }

      const { data, error } = await db.updateUser(user.id, dbUpdates);
      
      if (error) throw error;
      
      const normalizedUser = {
        ...data,
        firstName: data.first_name,
        lastName: data.last_name,
      };
      
      setUser(normalizedUser);
      return { success: true, user: normalizedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  // Add service (for providers)
  const addService = async (serviceData) => {
    if (user?.role !== 'provider') {
      return { success: false, error: 'Only providers can add services' };
    }
    
    try {
      const { data, error } = await db.createService({
        provider_id: user.id,
        ...serviceData
      });
      
      if (error) throw error;
      
      return { success: true, service: data };
    } catch (error) {
      console.error('Add service error:', error);
      return { success: false, error: error.message };
    }
  };

  // Get provider services
  const getMyServices = async () => {
    if (user?.role !== 'provider') return { success: false, data: [] };
    
    try {
      const { data, error } = await db.getProviderServices(user.id);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Get services error:', error);
      return { success: false, error: error.message, data: [] };
    }
  };

  // Create booking
  const createBooking = async (bookingData) => {
    try {
      const { data, error } = await db.createBooking({
        seeker_id: user.id,
        ...bookingData
      });
      
      if (error) throw error;
      
      return { success: true, booking: data };
    } catch (error) {
      console.error('Create booking error:', error);
      return { success: false, error: error.message };
    }
  };

  // Get user bookings
  const getMyBookings = async () => {
    if (!user) return { success: false, data: [] };
    
    try {
      const { data, error } = await db.getUserBookings(user.id, user.role);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Get bookings error:', error);
      return { success: false, error: error.message, data: [] };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAuthenticated: !!user,
      isProvider: user?.role === 'provider',
      isSeeker: user?.role === 'seeker',
      register,
      login,
      logout,
      updateProfile,
      addService,
      getMyServices,
      createBooking,
      getMyBookings,
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
