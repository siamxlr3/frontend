import { createClient } from '@supabase/supabase-js';

// We map Vite environment variables (they strictly require VITE_ prefix to be exposed to the browser)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in your .env");
    console.warn("Realtime WebSockets will not function until these are added.");
}

export const supabaseClient = supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;
