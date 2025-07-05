export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
}

export type TaskFilter = 'all' | 'completed' | 'pending';

export interface DeletedTask {
  task: Task;
  timestamp: number;
} 