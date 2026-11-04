export type ProjectStatus =
  | "In Progress"
  | "Completed"
  | "Delayed"
  | "Planned";

export type SupabaseProject = {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  budget: number;
  expenses: number;
  created_at: string;
  is_demo: boolean;
};

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: SupabaseProject;
        Insert: {
          id?: string;
          name: string;
          location?: string | null;
          description?: string | null;
          status?: ProjectStatus;
          progress?: number;
          budget?: number;
          expenses?: number;
          created_at?: string;
          is_demo?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string | null;
          description?: string | null;
          status?: ProjectStatus;
          progress?: number;
          budget?: number;
          expenses?: number;
          created_at?: string;
          is_demo?: boolean;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
