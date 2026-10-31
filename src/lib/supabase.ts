import { createClient } from "@supabase/supabase-js";
import { isLocalPreview } from "./preview";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
  console.warn("Missing Supabase URL or Key. Please check your .env file.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key",
  {
    auth: {
      autoRefreshToken: !isLocalPreview,
      persistSession: !isLocalPreview,
      detectSessionInUrl: !isLocalPreview,
    },
  },
);
