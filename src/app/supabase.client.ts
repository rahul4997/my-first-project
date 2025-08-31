// src/app/supabase.client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://fznugcmivfygenyjwwrt.supabase.co', // Project URL (from Supabase Settings → API)
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bnVnY21pdmZ5Z2VueWp3d3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2Mzg0NDMsImV4cCI6MjA3MjIxNDQ0M30.kcV294W7PuA07cjkfuWWQbhap7CtT6c3p4ylMJsF_Pk'                 // anon public key (safe for browser)
);
