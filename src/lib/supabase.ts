import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/data/supabaseProject.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

export const supabaseConfigError = !supabaseUrl
  ? "Supabase URL mungon. Plotëso EXPO_PUBLIC_SUPABASE_URL në .env."
  : !supabaseAnonKey
    ? "Çelësi publik Supabase mungon. Plotëso EXPO_PUBLIC_SUPABASE_ANON_KEY në .env."
    : null;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : null;
