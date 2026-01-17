-- ============================================
-- MYTROUVEPRO DATABASE SCHEMA
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('provider', 'seeker')),
  
  -- Profile info
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  
  -- Location
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(50) DEFAULT 'QC',
  postal_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Status
  verified BOOLEAN DEFAULT FALSE,
  profile_complete BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Language preference
  preferred_language VARCHAR(2) DEFAULT 'fr'
);

-- ============================================
-- PROVIDER PROFILES
-- ============================================
CREATE TABLE provider_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Business info
  business_name VARCHAR(255),
  business_description TEXT,
  license_number VARCHAR(100),
  insurance_number VARCHAR(100),
  
  -- Financial
  commission_rate DECIMAL(5, 2) DEFAULT 10.00, -- 10%
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  available_balance DECIMAL(10, 2) DEFAULT 0,
  
  -- Stats
  total_bookings INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  cancelled_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  
  -- Settings
  contact_hidden BOOLEAN DEFAULT TRUE,
  auto_accept_bookings BOOLEAN DEFAULT FALSE,
  response_time_hours INTEGER DEFAULT 24,
  
  -- Availability
  available_days JSONB, -- ["monday", "tuesday", ...]
  working_hours JSONB, -- {"start": "09:00", "end": "17:00"}
  
  -- Verification
  identity_verified BOOLEAN DEFAULT FALSE,
  background_checked BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  category_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Pricing
  base_price DECIMAL(10, 2) NOT NULL,
  price_type VARCHAR(20) CHECK (price_type IN ('fixed', 'hourly', 'quote')),
  
  -- Media
  images JSONB, -- Array of image URLs
  video_url TEXT,
  
  -- Service details
  duration_minutes INTEGER,
  location_type VARCHAR(20) CHECK (location_type IN ('on_site', 'remote', 'both')),
  service_radius_km INTEGER,
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  
  -- SEO
  slug VARCHAR(255) UNIQUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Parties
  seeker_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  
  -- Booking details
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_minutes INTEGER,
  
  -- Location
  service_address TEXT,
  service_city VARCHAR(100),
  service_postal_code VARCHAR(10),
  
  -- Pricing
  service_price DECIMAL(10, 2) NOT NULL,
  tps DECIMAL(10, 2) NOT NULL, -- 5%
  tvq DECIMAL(10, 2) NOT NULL, -- 9.975%
  total_amount DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  provider_payout DECIMAL(10, 2) NOT NULL,
  
  -- Payment
  payment_id VARCHAR(255), -- Square payment ID
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method VARCHAR(50),
  payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined, completed, cancelled
  
  -- Notes
  seeker_notes TEXT,
  provider_notes TEXT,
  cancellation_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  booking_id UUID REFERENCES bookings(id),
  provider_id UUID REFERENCES users(id),
  seeker_id UUID REFERENCES users(id),
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  
  -- Provider response
  provider_response TEXT,
  provider_response_date TIMESTAMP WITH TIME ZONE,
  
  -- Verification
  verified_booking BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE (for in-app chat)
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  booking_id UUID REFERENCES bookings(id),
  provider_id UUID REFERENCES users(id),
  
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(20), -- payment, refund, payout, commission
  
  square_payment_id VARCHAR(255),
  square_reference_id VARCHAR(255),
  
  status VARCHAR(20), -- pending, completed, failed
  
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- FAVORITES TABLE
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  seeker_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES users(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(seeker_id, provider_id)
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID REFERENCES users(id),
  
  type VARCHAR(50), -- booking, message, review, payment
  title VARCHAR(255),
  message TEXT,
  
  link TEXT,
  
  read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_provider_profiles_user_id ON provider_profiles(user_id);
CREATE INDEX idx_services_provider_id ON services(provider_id);
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_bookings_seeker_id ON bookings(seeker_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_transactions_provider_id ON transactions(provider_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at BEFORE UPDATE ON provider_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Provider profiles
CREATE POLICY "Anyone can view provider profiles" ON provider_profiles FOR SELECT USING (true);
CREATE POLICY "Providers can update own profile" ON provider_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Services
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (active = true);
CREATE POLICY "Providers can manage own services" ON services FOR ALL USING (auth.uid() = provider_id);

-- Bookings
CREATE POLICY "Users can view their bookings" ON bookings FOR SELECT 
USING (auth.uid() = seeker_id OR auth.uid() = provider_id);

-- Reviews
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Seekers can create reviews for their bookings" ON reviews FOR INSERT 
WITH CHECK (auth.uid() = seeker_id);

-- Messages
CREATE POLICY "Users can view their messages" ON messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================
-- Add sample provider
INSERT INTO users (email, password_hash, role, first_name, last_name, city, verified, profile_complete)
VALUES ('demo@mytrouvepro.com', '$2a$10$samplehash', 'provider', 'Demo', 'Provider', 'Laval', true, true);
