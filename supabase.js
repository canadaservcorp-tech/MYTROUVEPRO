// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================

import { createClient } from '@supabase/supabase-js';

// Get from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase credentials missing! Check .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper functions
export const signUp = async (email, password, metadata) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Database helpers
export const db = {
  // Users
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    return { data, error };
  },
  
  async getUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },
  
  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },
  
  // Provider Profiles
  async createProviderProfile(profileData) {
    const { data, error } = await supabase
      .from('provider_profiles')
      .insert([profileData])
      .select()
      .single();
    return { data, error };
  },
  
  async getProviderProfile(userId) {
    const { data, error } = await supabase
      .from('provider_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },
  
  // Services
  async createService(serviceData) {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();
    return { data, error };
  },
  
  async getProviderServices(providerId) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('provider_id', providerId)
      .eq('active', true);
    return { data, error };
  },
  
  async searchServices(filters = {}) {
    let query = supabase
      .from('services')
      .select(`
        *,
        provider:users!provider_id (
          id,
          first_name,
          last_name,
          city,
          avatar_url
        ),
        provider_profile:provider_profiles!provider_id (
          average_rating,
          total_reviews,
          response_time_hours
        )
      `)
      .eq('active', true);
    
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    
    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }
    
    const { data, error } = await query;
    return { data, error };
  },
  
  // Bookings
  async createBooking(bookingData) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
    return { data, error };
  },
  
  async getUserBookings(userId, role = 'seeker') {
    const field = role === 'seeker' ? 'seeker_id' : 'provider_id';
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service:services(*),
        seeker:users!seeker_id(first_name, last_name, email, phone),
        provider:users!provider_id(first_name, last_name, email, phone)
      `)
      .eq(field, userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },
  
  async updateBooking(bookingId, updates) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();
    return { data, error };
  },
  
  // Reviews
  async createReview(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();
    return { data, error };
  },
  
  async getProviderReviews(providerId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        seeker:users!seeker_id(first_name, last_name, avatar_url)
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};

export default supabase;
