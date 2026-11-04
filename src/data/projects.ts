import { supabase, supabaseConfigError } from "@/lib/supabase";
import type { SupabaseProject } from "@/data/supabaseProject.types";

export async function getProjects(): Promise<SupabaseProject[]> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? "Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Nuk u morën projektet nga Supabase: ${error.message}`);
  }

  return data;
}

export async function getProjectById(
  id: string,
): Promise<SupabaseProject | null> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? "Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Nuk u mor projekti nga Supabase: ${error.message}`);
  }

  return data;
}
