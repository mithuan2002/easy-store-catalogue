
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get database URL from environment variables
const SUPABASE_URL = 'https://tpqrstetovsafkzoeyjf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcXJzdGV0b3ZzYWZrem9leWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MzI3ODEsImV4cCI6MjA1NTAwODc4MX0.87EyMfY_dq9wkTLQC3yOUcGMm-ICFj4eftfVj6bKY_c';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
