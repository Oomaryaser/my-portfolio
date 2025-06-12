import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ||
  'https://qcksgbqxpiecvieidhky.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFja3NnYnF4cGllY3ZpZWlkaGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODE4ODQsImV4cCI6MjA2NTI1Nzg4NH0.aFlAErHP5YrwtlrMa81Qex1duD3-RJtNKUJcAjVxNy4';
// Use the service role key on the server to bypass row level security
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey || supabaseAnonKey);

export default supabase;
