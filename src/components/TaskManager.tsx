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
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

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

  const handleFilterChange = (filter: TaskFilterType | string) => {
    if (filter === 'all' || filter === 'completed' || filter === 'pending') {
      setFilter(filter);
    }
  };

  const filteredTasks = tasks.filter((task: Task) => {
    let statusMatch = true;
    if (filter === 'completed') statusMatch = task.completed;
    else if (filter === 'pending') statusMatch = !task.completed;
    let priorityMatch = priorityFilter === 'all' ? true : task.priority === priorityFilter;
    return statusMatch && priorityMatch;
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
      <TaskFilter
        currentFilter={filter}
        onFilterChange={handleFilterChange}
        taskCounts={counts}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
      />
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