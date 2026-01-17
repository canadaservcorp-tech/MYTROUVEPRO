import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, signUp, signIn, signOut, getCurrentUser, db } from '../lib/supabase';

const AuthContext = createContext(null);

const COMMISSION_RATE = 0.1;

const mapUserFields = (data) => ({
  first_name: data.firstName?.trim() || null,
  last_name: data.lastName?.trim() || null,
  phone: data.phone?.trim() || null,
  city: data.city?.trim() || null,
  address: data.address?.trim() || null,
  postal_code: data.postalCode?.trim() || null,
});

const mapProviderFields = (data) => ({
  business_name: data.businessName?.trim() || null,
  business_description: data.description?.trim() || null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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

      setUser(userData);

      if (userData.role === 'provider') {
        const { data: providerData } = await db.getProviderProfile(userId);
        setProfile(providerData || null);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const register = async (formData) => {
    try {
      const { email, password, role } = formData;
      const userFields = mapUserFields(formData);
      const providerFields = mapProviderFields(formData);

      const { data: authData, error: authError } = await signUp(email, password, {
        role,
        ...userFields,
      });

      if (authError) throw authError;
      const userId = authData?.user?.id;
      if (!userId) throw new Error('Signup succeeded but no user id returned');

      const { data: newUser, error: userError } = await db.createUser({
        id: userId,
        email,
        role,
        ...userFields,
        verified: false,
        profile_complete: false,
      });

      if (userError) throw userError;

      if (role === 'provider') {
        const { data: providerData, error: providerError } = await db.createProviderProfile({
          user_id: userId,
          commission_rate: COMMISSION_RATE * 100,
          contact_hidden: true,
          ...providerFields,
        });

        if (providerError) throw providerError;
        setProfile(providerData);
      }

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

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

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const userUpdates = mapUserFields(updates);
      const providerUpdates = mapProviderFields(updates);

      const { data, error } = await db.updateUser(user.id, userUpdates);
      if (error) throw error;

      let updatedProfile = profile;
      if (user?.role === 'provider') {
        const { data: providerData, error: providerError } = await db.updateProviderProfile(user.id, providerUpdates);
        if (providerError) throw providerError;
        updatedProfile = providerData;
      }

      setUser(data);
      setProfile(updatedProfile);
      return { success: true, user: data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  const addService = async (serviceData) => {
    if (user?.role !== 'provider') {
      return { success: false, error: 'Only providers can add services' };
    }

    const payload = {
      provider_id: user.id,
      category_id: serviceData.categoryId,
      title: serviceData.title,
      description: serviceData.description || null,
      base_price: serviceData.price,
      price_type: serviceData.priceType || 'fixed',
      images: serviceData.images || [],
      active: true,
    };

    try {
      const { data, error } = await db.createService(payload);
      if (error) throw error;
      return { success: true, service: data };
    } catch (error) {
      console.error('Add service error:', error);
      return { success: false, error: error.message };
    }
  };

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

  const createBooking = async (bookingData) => {
    if (!user) return { success: false, error: 'User is required' };

    const subtotal = Number(bookingData.service_price || 0);
    const tps = Number((subtotal * 0.05).toFixed(2));
    const tvq = Number((subtotal * 0.09975).toFixed(2));
    const total = Number((subtotal + tps + tvq).toFixed(2));
    const commissionAmount = Number((subtotal * COMMISSION_RATE).toFixed(2));
    const providerPayout = Number((subtotal - commissionAmount).toFixed(2));

    const payload = {
      seeker_id: user.id,
      ...bookingData,
      tps,
      tvq,
      total_amount: total,
      commission_amount: commissionAmount,
      provider_payout: providerPayout,
    };

    try {
      const { data, error } = await db.createBooking(payload);
      if (error) throw error;
      return { success: true, booking: data };
    } catch (error) {
      console.error('Create booking error:', error);
      return { success: false, error: error.message };
    }
  };

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

  const value = useMemo(() => ({
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
  }), [user, profile, loading]);

  return (
    <AuthContext.Provider value={value}>
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
