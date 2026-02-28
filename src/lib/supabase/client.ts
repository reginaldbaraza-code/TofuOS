import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If we are during the build phase and variables are missing, 
// we provide a "stub" client to prevent the build from crashing.
// In production, these variables will be provided by Vercel.
const isReady = !!supabaseUrl && !!supabaseAnonKey;

export const supabase = isReady 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); 

// Helper to ensure we don't call supabase if it's not initialized
export const getSupabase = () => {
  if (!supabase) {
    if (typeof window !== 'undefined') {
      console.error('Supabase environment variables are missing!');
    }
  }
  return supabase;
};
