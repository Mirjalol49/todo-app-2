import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isUrlValid = (url: string | undefined) => url && url.startsWith('http');
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && isUrlValid(supabaseUrl));

// Fallback to avoid app crash on startup if variables are missing
const validUrl = isSupabaseConfigured ? supabaseUrl : 'https://example.supabase.co';
const validKey = isSupabaseConfigured ? supabaseAnonKey : 'example-key';

export const supabase = createClient(validUrl, validKey);
