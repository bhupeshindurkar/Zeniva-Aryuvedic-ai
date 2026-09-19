-- ==============================================================================
-- ZENIVA AI - SUPABASE POSTGRESQL DATABASE INITIALIZATION & MIGRATIONS
-- Project: Zeniva AI Ayurvedic Healthcare & Clinical Opportunities Platform
-- Tables: profiles, opportunities, saved_opportunities, applications,
--         doctors, appointments, doctor_reviews, dosha_assessments, ayurvedic_corpus, system_broadcasts
-- Features: Row Level Security (RLS), Triggers, Storage Buckets, Full Indexes
-- ==============================================================================

-- 1. ENABLE REQUIRED EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CREATE DATABASE TABLES
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Table 1: PROFILES (User & Patient Profiles linked to Supabase Auth)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT UNIQUE,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'super_admin')),
    title TEXT,
    age TEXT,
    gender TEXT,
    prakriti TEXT,
    vikriti TEXT,
    specialization TEXT,
    qualification TEXT,
    experience_years INTEGER DEFAULT 0,
    organization TEXT,
    location TEXT,
    city TEXT,
    blood_group TEXT,
    diet TEXT,
    agribalam TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending_verification', 'verified', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 2: OPPORTUNITIES (Ayurvedic Research, Clinical Fellowships & Careers)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT DEFAULT 'Remote / Hybrid',
    type TEXT NOT NULL DEFAULT 'Full-Time' CHECK (type IN ('Full-Time', 'Part-Time', 'Internship', 'Fellowship', 'Research', 'Contract')),
    category TEXT NOT NULL DEFAULT 'Ayurvedic Clinical' CHECK (category IN ('Ayurvedic Clinical', 'Panchakarma', 'R&D', 'AI & Digital Health', 'Consulting', 'Pharmacology')),
    requirements JSONB DEFAULT '[]'::jsonb,
    stipend_or_salary TEXT,
    deadline TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 3: SAVED OPPORTUNITIES (Bookmarks/Bookmarks per User)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_saved_opportunity UNIQUE (user_id, opportunity_id)
);

-- ------------------------------------------------------------------------------
-- Table 4: APPLICATIONS (Clinical & Opportunity Job Applications)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
    resume_url TEXT,
    cover_note TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 5: DOCTORS (Registered Ayurvedic Practitioners & Medical Credentials)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    dob TEXT,
    gender TEXT,
    profession TEXT DEFAULT 'Ayurvedic Physician',
    role TEXT DEFAULT 'Consultant Vaidya',
    specialization TEXT,
    qualification TEXT,
    experience_years INTEGER DEFAULT 0,
    organization TEXT,
    city TEXT,
    council_name TEXT,
    council_reg_number TEXT,
    documents_json JSONB DEFAULT '[]'::jsonb,
    avatar TEXT,
    status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    verified_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- Table 6: APPOINTMENTS (Patient - Doctor Clinical Consultations)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    patient_name TEXT,
    doctor_name TEXT,
    date_time TIMESTAMPTZ NOT NULL,
    type TEXT DEFAULT 'Consultation' CHECK (type IN ('Consultation', 'Follow-up', 'Emergency', 'Panchakarma Checkup')),
    status TEXT DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Completed', 'Cancelled', 'Rescheduled')),
    dosha_imbalance TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 7: DOCTOR REVIEWS (Manual Doctor Review Queue for Photos & Clinical Submissions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.doctor_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    patient_name TEXT,
    doctor_name TEXT,
    image_url TEXT,
    symptoms TEXT,
    review_notes TEXT,
    status TEXT DEFAULT 'pending_doctor_review' CHECK (status IN ('pending_doctor_review', 'reviewed', 'rejected', 'archived')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 8: DOSHA ASSESSMENTS (Ayurvedic Prakriti / Vikriti Assessment Records)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dosha_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT,
    vata INTEGER DEFAULT 0,
    pitta INTEGER DEFAULT 0,
    kapha INTEGER DEFAULT 0,
    primary_dosha TEXT,
    wellness_score INTEGER DEFAULT 80,
    answers JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 9: AYURVEDIC CORPUS (RAG Knowledge Database: Charaka, Sushruta, Ashtanga)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ayurvedic_corpus (
    id TEXT PRIMARY KEY,
    samhita TEXT NOT NULL,
    chapter TEXT,
    sutra_title TEXT,
    category TEXT,
    sanskrit_sloka TEXT,
    english_translation TEXT,
    indications TEXT,
    herbal_remedies TEXT,
    lifestyle_advice TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Table 10: SYSTEM BROADCASTS (Live Announcements & Guidance Video Streams)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_broadcasts (
    key TEXT PRIMARY KEY,
    enabled BOOLEAN DEFAULT FALSE,
    title TEXT,
    sanskrit TEXT,
    duration TEXT,
    url TEXT,
    description TEXT,
    published_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

CREATE INDEX IF NOT EXISTS idx_opportunities_category ON public.opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_is_active ON public.opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_by ON public.opportunities(created_by);

CREATE INDEX IF NOT EXISTS idx_saved_opps_user_id ON public.saved_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_opps_opp_id ON public.saved_opportunities(opportunity_id);

CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_opp_id ON public.applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

CREATE INDEX IF NOT EXISTS idx_doctors_phone ON public.doctors(phone);
CREATE INDEX IF NOT EXISTS idx_doctors_status ON public.doctors(status);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

CREATE INDEX IF NOT EXISTS idx_doctor_reviews_patient_id ON public.doctor_reviews(patient_id);
CREATE INDEX IF NOT EXISTS idx_doctor_reviews_status ON public.doctor_reviews(status);

CREATE INDEX IF NOT EXISTS idx_dosha_assessments_user_id ON public.dosha_assessments(user_id);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dosha_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ayurvedic_corpus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_broadcasts ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Profiles Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- Opportunities Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Active opportunities are viewable by everyone" ON public.opportunities;
CREATE POLICY "Active opportunities are viewable by everyone" 
ON public.opportunities FOR SELECT 
USING (is_active = true OR auth.uid() = created_by);

DROP POLICY IF EXISTS "Authenticated users can create opportunities" ON public.opportunities;
CREATE POLICY "Authenticated users can create opportunities" 
ON public.opportunities FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Creators can update their opportunities" ON public.opportunities;
CREATE POLICY "Creators can update their opportunities" 
ON public.opportunities FOR UPDATE 
TO authenticated 
USING (auth.uid() = created_by);

-- ------------------------------------------------------------------------------
-- Saved Opportunities Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage their saved opportunities" ON public.saved_opportunities;
CREATE POLICY "Users can manage their saved opportunities" 
ON public.saved_opportunities FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Applications Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Applicants can view their own applications" ON public.applications;
CREATE POLICY "Applicants can view their own applications" 
ON public.applications FOR SELECT 
TO authenticated 
USING (auth.uid() = applicant_id);

DROP POLICY IF EXISTS "Applicants can submit applications" ON public.applications;
CREATE POLICY "Applicants can submit applications" 
ON public.applications FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = applicant_id);

DROP POLICY IF EXISTS "Opportunity owners can view received applications" ON public.applications;
CREATE POLICY "Opportunity owners can view received applications" 
ON public.applications FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.opportunities o 
        WHERE o.id = applications.opportunity_id AND o.created_by = auth.uid()
    )
);

-- ------------------------------------------------------------------------------
-- Doctors Table Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Doctor records viewable by public and authenticated" ON public.doctors;
CREATE POLICY "Doctor records viewable by public and authenticated" 
ON public.doctors FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Doctors can update their registration" ON public.doctors;
CREATE POLICY "Doctors can update their registration" 
ON public.doctors FOR ALL 
USING (true);

-- ------------------------------------------------------------------------------
-- Appointments Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their appointments" ON public.appointments;
CREATE POLICY "Users can view their appointments" 
ON public.appointments FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Users can book appointments" ON public.appointments;
CREATE POLICY "Users can book appointments" 
ON public.appointments FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = patient_id);

-- ------------------------------------------------------------------------------
-- Doctor Reviews Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Patients and Doctors can access relevant reviews" ON public.doctor_reviews;
CREATE POLICY "Patients and Doctors can access relevant reviews" 
ON public.doctor_reviews FOR ALL 
USING (true);

-- ------------------------------------------------------------------------------
-- Dosha Assessments Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own dosha assessments" ON public.dosha_assessments;
CREATE POLICY "Users can view their own dosha assessments" 
ON public.dosha_assessments FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save their dosha assessments" ON public.dosha_assessments;
CREATE POLICY "Users can save their dosha assessments" 
ON public.dosha_assessments FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Ayurvedic Corpus & Broadcasts (Read-only for public, manageable by admin)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Ayurvedic corpus viewable by all" ON public.ayurvedic_corpus;
CREATE POLICY "Ayurvedic corpus viewable by all" 
ON public.ayurvedic_corpus FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "System broadcasts viewable by all" ON public.system_broadcasts;
CREATE POLICY "System broadcasts viewable by all" 
ON public.system_broadcasts FOR SELECT 
USING (true);

-- ==============================================================================
-- 5. AUTOMATED TRIGGERS (Updated_at & Auth.users -> Profiles Sync)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach updated_at triggers
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER set_opportunities_updated_at
    BEFORE UPDATE ON public.opportunities
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_applications_updated_at ON public.applications;
CREATE TRIGGER set_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create Profile record on Supabase Auth Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        phone,
        email,
        full_name,
        avatar_url,
        role
    )
    VALUES (
        NEW.id,
        NEW.phone,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Zeniva User'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
    )
    ON CONFLICT (id) DO UPDATE SET
        phone = EXCLUDED.phone,
        email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 6. STORAGE BUCKETS CONFIGURATION (SQL helper)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', true),
    ('documents', 'documents', false),
    ('review_photos', 'review_photos', false),
    ('resumes', 'resumes', false),
    ('broadcasts', 'broadcasts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public Avatar Access" ON storage.objects;
CREATE POLICY "Public Avatar Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars' OR bucket_id = 'broadcasts');

DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
CREATE POLICY "Authenticated Uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('avatars', 'documents', 'review_photos', 'resumes'));
