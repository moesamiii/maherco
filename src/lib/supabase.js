import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vvuspbyvwabftxxlpyku.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dXNwYnl2d2FiZnR4eGxweWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODYzNjksImV4cCI6MjA4NzE2MjM2OX0.j0vLcW2aN9bSr_8-uDdNDaifeCnaInQzAM6virkO5Zg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
