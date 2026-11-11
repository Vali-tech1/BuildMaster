import { supabase, supabaseConfigError } from "@/lib/supabase";
import type {
  ProjectStatus,
  SupabaseProject,
} from "@/data/supabaseProject.types";

export type NewProject = {
  name: string;
  location: string | null;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  budget: number;
  expenses: number;
};

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

export async function createProject(
  project: NewProject,
): Promise<SupabaseProject> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? "Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Projekti nuk u ruajt në Supabase: ${error.message}`);
  }

  return data;
}
