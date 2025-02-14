
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/defaultdb";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_ANON_KEY || "dummy-key";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
