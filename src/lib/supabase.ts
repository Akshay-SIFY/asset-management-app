import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase Credentials provided by user
const supabaseUrl = "https://wzlfcrrtiwlhygfsdaja.supabase.co";
const supabaseAnonKey = "sb_publishable_Emsc1PCnFzNBhqJwrwAjpw_skTlb5qH";

// Initialize Supabase client
// If keys were missing (handled at runtime), createClient would normally throw or return a limited client
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
