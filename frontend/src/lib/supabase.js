import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mlcntppviktvsafqlzmi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__Euxk0t3YSV5rI8CnLzSJg_R3LaxMVj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'zeniva-supabase-auth-token',
  },
});

// ==========================================
// AUTHENTICATION HELPERS
// ==========================================

export async function signUpUser({ email, password, phone, metadata = {} }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    phone,
    options: {
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
}

export async function signInUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWithOtp({ phone, email }) {
  const params = phone ? { phone } : { email };
  const { data, error } = await supabase.auth.signInWithOtp(params);
  if (error) throw error;
  return data;
}

export async function verifyOtp({ phone, email, token, type = 'sms' }) {
  const params = {
    token,
    type,
    ...(phone ? { phone } : { email }),
  };
  const { data, error } = await supabase.auth.verifyOtp(params);
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

// ==========================================
// PROFILES API HELPERS
// ==========================================

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function fetchProfileByPhone(phone) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('phone', phone)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function upsertProfile(profileData) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profileData, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==========================================
// OPPORTUNITIES & CAREER/RESEARCH HELPERS
// ==========================================

export async function fetchOpportunities(filters = {}) {
  let query = supabase
    .from('opportunities')
    .select('*, profiles:created_by(full_name, avatar_url, role)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createOpportunity(opportunityData) {
  const { data, error } = await supabase
    .from('opportunities')
    .insert([opportunityData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchSavedOpportunities(userId) {
  const { data, error } = await supabase
    .from('saved_opportunities')
    .select('*, opportunities(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function toggleSaveOpportunity(userId, opportunityId, isSaved) {
  if (isSaved) {
    const { error } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from('saved_opportunities')
      .insert([{ user_id: userId, opportunity_id: opportunityId }]);
    if (error) throw error;
    return true;
  }
}

// ==========================================
// APPLICATIONS HELPERS
// ==========================================

export async function fetchApplications(userId, isApplicant = true) {
  let query = supabase.from('applications').select('*, opportunities(*), profiles:applicant_id(*)');
  if (isApplicant) {
    query = query.eq('applicant_id', userId);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function submitApplication(applicationData) {
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==========================================
// ZENIVA PLATFORM HELPERS (Appointments, Dosha, Reviews)
// ==========================================

export async function fetchAppointments(userId, role = 'patient') {
  let query = supabase.from('appointments').select('*').order('date_time', { ascending: true });
  if (role === 'patient') {
    query = query.eq('patient_id', userId);
  } else if (role === 'doctor') {
    query = query.eq('doctor_id', userId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createAppointment(appointmentData) {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchDoshaAssessments(userId) {
  const { data, error } = await supabase
    .from('dosha_assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveDoshaAssessment(assessmentData) {
  const { data, error } = await supabase
    .from('dosha_assessments')
    .insert([assessmentData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==========================================
// STORAGE HELPERS
// ==========================================

export async function uploadStorageFile(bucket, filePath, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { data, publicUrl };
}
