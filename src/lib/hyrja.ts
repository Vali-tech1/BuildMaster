import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseConfigError } from "@/lib/supabase";

function getSupabase() {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? "Supabase nuk është konfiguruar.");
  }

  return supabase;
}

export async function krijoLlogari(
  email: string,
  password: string,
): Promise<Session | null> {
  const { data, error } = await getSupabase().auth.signUp({ email, password });

  if (error) {
    throw error;
  }

  return data.session;
}

export async function hyjMeEmail(
  email: string,
  password: string,
): Promise<Session | null> {
  const { data, error } = await getSupabase().auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data.session;
}

export async function dilNgaLlogaria(): Promise<void> {
  const { error } = await getSupabase().auth.signOut({ scope: "local" });

  if (error) {
    throw error;
  }
}

export async function lexoSesioniAktiv(): Promise<Session | null> {
  const { data, error } = await getSupabase().auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}
