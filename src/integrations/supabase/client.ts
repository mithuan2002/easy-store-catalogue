
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get the database URL from environment
const SUPABASE_URL = import.meta.env.DATABASE_URL || 'postgresql://localhost:5432/defaultdb';
const SUPABASE_ANON_KEY = 'dummy-key-not-needed-for-direct-postgres';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
