export type ConstructionProjectStatus =
  | "In Progress"
  | "Completed"
  | "Delayed";

export type ProjectSection = "details" | "finances" | "reports";

export type ConstructionProject = {
  id: string;
  name: string;
  location: string;
  status: ConstructionProjectStatus;
  manager: string;
  startDate: string;
  expectedCompletionDate: string;
  totalBudget: number;
  actualExpenses: number;
  progressPercent: number;
  workers: number;
  activeTasks: number;
  completedTasks: number;
  delayedTasks: number;
  imageUri?: string;
};
