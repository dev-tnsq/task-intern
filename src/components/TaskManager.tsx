import React, { useEffect, useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import { Task, TaskFilter as TaskFilterType } from '../types/task';
import { loadTasks, saveTasks } from '../utils/localStorage';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilterType>('all');
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task: Task) => (task.id === updatedTask.id ? updatedTask : task)));
    setEditingTask(undefined);
  };

  const deleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task: Task) => task.id !== id));
    }
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map((task: Task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const filteredTasks = tasks.filter((task: Task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    completed: tasks.filter((t: Task) => t.completed).length,
    pending: tasks.filter((t: Task) => !t.completed).length,
  };

  return (
    <div>
      <TaskForm
        onSubmit={editingTask
          ? (data) => {
              if (editingTask) {
                updateTask({ ...editingTask, ...data });
              }
            }
          : addTask}
        editingTask={editingTask}
        onCancel={() => setEditingTask(undefined)}
      />
      <TaskFilter currentFilter={filter} onFilterChange={setFilter} taskCounts={counts} />
      <TaskList
        tasks={filteredTasks}
        onEdit={setEditingTask}
        onDelete={deleteTask}
        onToggle={toggleComplete}
      />
    </div>
  );
};

export default TaskManager; 