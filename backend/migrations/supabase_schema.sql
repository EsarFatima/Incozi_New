-- INCOZI Database Schema for Supabase
-- This SQL creates all necessary tables for the Incozi platform

-- ===== USERS TABLE =====
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT,
  role TEXT CHECK (role IN ('client', 'consultant', 'admin')) DEFAULT 'client',
  profile_picture_url TEXT,
  bio TEXT,
  credentials TEXT,
  expertise TEXT[],
  years_of_experience INT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badge TEXT CHECK (verification_badge IN ('none', 'verified', 'certified', 'expert')) DEFAULT 'none',
  stripe_customer_id TEXT,
  subscription_plan TEXT CHECK (subscription_plan IN ('free', 'basic', 'standard', 'premium')) DEFAULT 'free',
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  subscription_auto_renew BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  newsletter BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP,
  last_active TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_stripe_id ON public.users(stripe_customer_id);

-- ===== SERVICES TABLE =====
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('incorporation', 'bookkeeping', 'tax-compliance')) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  consultant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  base_price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  price_unit TEXT CHECK (price_unit IN ('one-time', 'hourly', 'monthly')) DEFAULT 'one-time',
  duration_minutes INT DEFAULT 60,
  image_url TEXT,
  image_urls TEXT[],
  availability_days INT[] DEFAULT '{1,2,3,4,5}',
  availability_start_time TEXT DEFAULT '09:00',
  availability_end_time TEXT DEFAULT '17:00',
  availability_timezone TEXT DEFAULT 'UTC',
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'inactive', 'archived')) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_services_consultant ON public.services(consultant_id);
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_services_status ON public.services(status);

-- ===== CONSULTATIONS TABLE =====
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMP NOT NULL,
  duration_minutes INT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')) DEFAULT 'pending',
  meeting_type TEXT CHECK (meeting_type IN ('video', 'phone', 'in-person', 'chat')) DEFAULT 'video',
  video_link TEXT,
  phone_number TEXT,
  location TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  payment_transaction_id TEXT,
  client_notes TEXT,
  consultant_notes TEXT,
  documents TEXT[],
  email_reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMP,
  cancellation_reason TEXT,
  cancelled_by TEXT CHECK (cancelled_by IN ('client', 'consultant', 'system')),
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_consultations_client ON public.consultations(client_id);
CREATE INDEX idx_consultations_consultant ON public.consultations(consultant_id);
CREATE INDEX idx_consultations_status ON public.consultations(status);
CREATE INDEX idx_consultations_date ON public.consultations(scheduled_date);
CREATE INDEX idx_consultations_booking_id ON public.consultations(booking_id);

-- ===== PAYMENTS TABLE =====
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_type TEXT CHECK (payment_type IN ('consultation', 'subscription', 'service')) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('credit_card', 'debit_card', 'stripe')) DEFAULT 'stripe',
  stripe_payment_intent_id TEXT,
  status TEXT CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
  description TEXT,
  invoice_number TEXT,
  invoice_url TEXT,
  receipt_url TEXT,
  refund_amount DECIMAL(10, 2),
  refund_reason TEXT,
  refunded_at TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_transaction ON public.payments(transaction_id);

-- ===== SUBSCRIPTIONS TABLE =====
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('basic', 'standard', 'premium')) NOT NULL,
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')) DEFAULT 'monthly',
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT CHECK (status IN ('active', 'paused', 'cancelled', 'expired')) DEFAULT 'active',
  consultations_per_month INT DEFAULT 0,
  max_documents INT DEFAULT 0,
  priority_support BOOLEAN DEFAULT FALSE,
  advanced_analytics BOOLEAN DEFAULT FALSE,
  custom_branding BOOLEAN DEFAULT FALSE,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  renewal_date TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  stripe_subscription_id TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- ===== MESSAGES TABLE =====
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'file', 'image', 'system')) DEFAULT 'text',
  attachment_urls TEXT[],
  attachment_file_names TEXT[],
  attachment_file_sizes INT[],
  attachment_file_types TEXT[],
  status TEXT CHECK (status IN ('sent', 'delivered', 'read')) DEFAULT 'sent',
  read_at TIMESTAMP,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);

-- ===== REVIEWS TABLE =====
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  professionalism_rating INT CHECK (professionalism_rating IS NULL OR (professionalism_rating >= 1 AND professionalism_rating <= 5)),
  expertise_rating INT CHECK (expertise_rating IS NULL OR (expertise_rating >= 1 AND expertise_rating <= 5)),
  communication_rating INT CHECK (communication_rating IS NULL OR (communication_rating >= 1 AND communication_rating <= 5)),
  timeliness_rating INT CHECK (timeliness_rating IS NULL OR (timeliness_rating >= 1 AND timeliness_rating <= 5)),
  tags TEXT[],
  helpful_count INT DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_consultant ON public.reviews(consultant_id, created_at DESC);
CREATE INDEX idx_reviews_service ON public.reviews(service_id, rating);

-- ===== DOCUMENTS TABLE =====
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INT NOT NULL,
  file_url TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('contract', 'invoice', 'receipt', 'notes', 'report', 'other')) DEFAULT 'other',
  visibility TEXT CHECK (visibility IN ('private', 'consultant', 'shared', 'public')) DEFAULT 'private',
  shared_with_user_ids UUID[] DEFAULT '{}'::uuid[],
  version INT DEFAULT 1,
  previous_version_urls TEXT[],
  uploaded_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  tags TEXT[],
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_user ON public.documents(user_id, created_at DESC);
CREATE INDEX idx_documents_consultation ON public.documents(consultation_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create auth link policy for users table (allow users to see their own record)
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Services - anyone can read, only consultants can manage theirs
CREATE POLICY "Anyone can view services" ON public.services
  FOR SELECT USING (TRUE);

CREATE POLICY "Consultants can create services" ON public.services
  FOR INSERT WITH CHECK (auth.uid()::text = consultant_id::text);

CREATE POLICY "Consultants can update their services" ON public.services
  FOR UPDATE USING (auth.uid()::text = consultant_id::text);

-- Consultations - users can view related ones
CREATE POLICY "Users can view their consultations" ON public.consultations
  FOR SELECT USING (
    auth.uid()::text = client_id::text OR 
    auth.uid()::text = consultant_id::text
  );

-- Messages - users can view their messages
CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT USING (
    auth.uid()::text = sender_id::text OR 
    auth.uid()::text = receiver_id::text
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid()::text = sender_id::text);
