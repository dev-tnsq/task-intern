import { Task } from '../types/task';

const TASKS_KEY = 'tasks';

export function loadTasks(): Task[] {
  const data = localStorage.getItem(TASKS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
} 