import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ||
  'https://lxkuvojqpgczvovcvwfw.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4a3V2b2pxcGdjenZvdmN2d2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MTU1MzEsImV4cCI6MjA2NDk5MTUzMX0.xDj9eFP_R9c2sz41ObODYNJmlBGt1Vt-rXDBIFOXZ2E';

// Use the service role key on the server to bypass row level security
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey || supabaseAnonKey);

export default supabase;
