
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use Replit's database URL
const SUPABASE_URL = `${process.env.DATABASE_URL || 'postgresql://localhost:5432/defaultdb'}`;
const SUPABASE_ANON_KEY = 'dummy-key-not-needed-for-direct-postgres';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false
  }
});
